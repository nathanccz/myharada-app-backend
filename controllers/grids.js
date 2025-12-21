const User = require('../models/User')
const Grid = require('../models/Grid')
const gridTemplate = require('../data/grid-template.json')
const fs = require('fs')
const { mergeToNewGridTemplate } = require('../utils/helpers.js')

module.exports = {
  getGrid: async (req, res) => {
    const gridId = req.params.id

    try {
      const grid = await Grid.find({ _id: gridId }).lean()

      if (Object.keys(grid).length === 0) {
        return res.json({ grid: {} })
      }

      return res.json({ grid: grid })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  addGrid: async (req, res) => {
    const grid = req.body
    grid.userId = req.user.id

    try {
      await Grid.create(grid)
      return res.status(201).json({ message: 'Grid successfully added' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  getGrids: async (req, res) => {
    console.log(req.user)
    try {
      const savedGrids = await Grid.find({ userId: req.user.id })
      const templateGrids = await Grid.find({
        userId: process.env.ADMIN_USER_ID,
        templateCategory: { $exists: true, $ne: null },
      })

      if (savedGrids.length === 0) {
        return res.json({ grids: [], templates: templateGrids })
      }

      return res.json({ grids: savedGrids, templates: templateGrids })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  pinGrid: async (req, res) => {
    const gridId = req.params.id

    try {
      await Grid.findOneAndUpdate({ gridId: gridId }, { pinned: true })

      return res.status(204).json('pinned!')
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  deleteGrid: async (req, res) => {
    try {
      const user = req.user.id
      const gridId = req.params.id

      const deletedGrid = await Grid.findOneAndDelete({
        userId: user,
        _id: gridId,
      })

      if (!deletedGrid) {
        return res.status(400).json({ message: 'No grid found.' })
      }

      return res.status(200).json({ message: 'Grid successfully deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  editGrid: async (req, res) => {
    const { grid } = req.body
    const id = req.params.id

    if (!id) {
      return res.status(400).json({ message: 'Missing grid ID' })
    }
    if (!Array.isArray(grid)) {
      return res.status(400).json({ message: 'grids must be an array' })
    }

    try {
      const result = await Grid.findOneAndUpdate(
        { _id: id },
        { grids: grid, lastModified: new Date().toISOString() }
      )

      if (!result) {
        return res.status(404).json({ message: 'Grid not found' })
      }
      return res.status(200).json({ message: 'Grid updated successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },
  editGridDetails: async (req, res) => {
    const { title, description, gridType } = req.body
    const id = req.params.id

    if (!id) {
      return res.status(400).json({ message: 'Missing grid ID' })
    }

    try {
      const result = await Grid.findOneAndUpdate(
        { _id: id },
        { title: title, description: description, gridType: gridType }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Grid not found' })
      }
      return res
        .status(200)
        .json({ message: 'Grid details updated successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },
  clearGridCells: async (req, res) => {
    const grid = { ...gridTemplate, userId: req.user.id }
    const id = req.params.id

    if (!id) {
      return res.status(400).json({ message: 'Missing grid ID' })
    }

    try {
      const result = await Grid.findOneAndReplace({ _id: id }, grid)

      if (!result) {
        return res.status(404).json({ message: 'Grid not found' })
      }
      return res
        .status(200)
        .json({ message: 'Grid details updated successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },
  setToComplete: async (req, res) => {
    const gridId = req.params.id

    try {
      const result = await Grid.findOneAndUpdate(
        { _id: gridId },
        { completedAt: new Date().toISOString() }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Grid not found' })
      }
      return res.status(200).json({ message: 'Grid set to completed!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server Error' })
    }
  },

  getAIGeneratedGrid: async (req, res) => {
    const { message } = req.body
    const userId = req.user.id

    if (!message) {
      return res.status(400).json({ error: 'Missing goal!' })
    }

    try {
      const GROQ_API_KEY = process.env.GROQ_API_KEY

      let validationPrompt = fs.readFileSync(
        'data/groq-ai-validation-prompt.md',
        'utf8'
      )

      validationPrompt = validationPrompt.replaceAll('{{GOAL}}', message)

      const validationResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: validationPrompt,
              },
            ],
          }),
        }
      )

      if (!validationResponse.ok) {
        const errorData = await validationResponse.json()
        console.error('Groq API error:', errorData)

        return res.status(500).json({ error: errorData })
      }

      const validationData = await validationResponse.json()
      const validationResultFromGroq = validationData.choices[0].message.content

      if (validationResultFromGroq === 'INVALID') {
        return res.status(400).json({ error: 'Unable to process request.' })
      }

      let mainPrompt = fs.readFileSync('data/groq-ai-main-prompt.md', 'utf8')

      mainPrompt = mainPrompt.replaceAll('{{GOAL}}', message)

      const mainResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: mainPrompt,
              },
            ],
          }),
        }
      )

      if (!mainResponse.ok) {
        const errorData = await mainResponse.json()
        console.error('Groq API error:', errorData)

        return res.status(500).json({ error: errorData })
      }

      const mainData = await mainResponse.json()
      const mainResultFromGroq = mainData.choices[0].message.content
      const parsedMainResult = JSON.parse(mainResultFromGroq)

      const mergedGrid = mergeToNewGridTemplate(parsedMainResult, {
        ...gridTemplate,
      })

      mergedGrid.userId = userId
      mergedGrid.gridType = 'project'

      const newGrid = await Grid.create(mergedGrid)

      return res.status(201).json({
        message: 'Grid successfully added',
        grid: newGrid,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
}
