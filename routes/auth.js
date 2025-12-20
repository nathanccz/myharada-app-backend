const express = require('express')
const passport = require('passport')
const router = express.Router()

//@desc     Auth with Google
//@route    GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc     Google auth callback
//@route    GET /auth/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('✅ CALLBACK ROUTE HIT!')
    console.log('User:', req.user)
    console.log('Is authenticated:', req.isAuthenticated())

    res.redirect('/profile')
  }
)

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res, next) => {
  //Note: Check passports.js documentation for new callback requirement.
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

module.exports = router
