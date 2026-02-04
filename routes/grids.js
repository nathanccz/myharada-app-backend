const express = require('express')
const router = express.Router()
const gridsController = require('../controllers/grids')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { authenticate } = require('../middleware/firebaseAuth')

router.get('/grid/:id', gridsController.getGrid)
router.post('/add', authenticate, gridsController.addGrid)
router.get('/all', authenticate, gridsController.getGrids)
router.patch('/:id/pin', gridsController.pinGrid)
router.delete('/delete/:id', authenticate, gridsController.deleteGrid)
router.put('/edit/:id', authenticate, gridsController.editGrid)
router.put('/editDetails/:id', authenticate, gridsController.editGridDetails)
router.put('/clearCells/:id', authenticate, gridsController.clearGridCells)
router.put('/markComplete/:id', authenticate, gridsController.setToComplete)
router.post('/groqai', authenticate, gridsController.getAIGeneratedGrid)

module.exports = router
