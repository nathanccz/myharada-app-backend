const express = require('express')
const router = express.Router()
const gridsController = require('../controllers/grids')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/grid/:id', gridsController.getGrid)
router.post('/add', gridsController.addGrid)
router.get('/all', gridsController.getGrids)
router.put('/:id/pin', gridsController.pinGrid)
router.delete('/delete/:id', gridsController.deleteGrid)
router.put('/edit/:id', gridsController.editGrid)
router.put('/editDetails/:id', gridsController.editGridDetails)
router.put('/clearCells/:id', gridsController.clearGridCells)
router.put('/markComplete/:id', gridsController.setToComplete)
router.post('/groqai', gridsController.getAIGeneratedGrid)

module.exports = router
