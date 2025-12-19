const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/api/dashboard', ensureAuth, homeController.getIndex)
router.get('/api/google', authController.getLogin)
router.get('/api/google/callback', authController.postLogin, authController.googleCallback)
router.get('/api/logout', authController.logout)

module.exports = router