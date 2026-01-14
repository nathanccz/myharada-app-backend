const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { authenticate } = require('../middleware/firebaseAuth')

router.get('/api/health', homeController.getHealth)
router.get('/api/auth/dashboard', authenticate, homeController.getIndex)
router.get('/auth/google', authController.getLogin)
router.get('/api/auth/firebase-login', authenticate, authController.handleLogin)
router.get(
  '/api/auth/google/callback',

  authController.postLogin,
  authController.googleCallback
)
router.get('/api/auth/logout/', authController.logout)

module.exports = router
