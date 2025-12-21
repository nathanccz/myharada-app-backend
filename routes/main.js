const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/api/auth/dashboard', ensureAuth, homeController.getIndex)
router.get('/auth/google', authController.getLogin)
router.get(
  '/auth/google/callback',
  authController.postLogin,
  authController.googleCallback
)
router.get('/auth/logout', authController.logout)

module.exports = router
