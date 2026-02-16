const express = require('express')
const passport = require('passport')

module.exports = {
  // Route to trigger Google login
  getLogin: (req, res, next) => {
    console.log('hey')
    // Call passport.authenticate() to initiate Google OAuth
    passport.authenticate('google', { scope: ['profile'] })(req, res, next)
  },
  handleLogin: async (req, res) => {
    console.log('is this hitting')
    return res.status(200).json({ message: req.user })
  },
  // Route for the callback after Google login attempt
  postLogin: (req, res, next) => {
    console.log('PostLogin fired')
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('Auth error:', err)
        return next(err)
      }

      if (!user) {
        console.log('No user, redirecting to login')
        return res.redirect(`${process.env.REDIRECT_URL_BASE}/`)
      }

      // Manually log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr)
          return next(loginErr)
        }

        // NOW explicitly save the session
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr)
            return res.redirect(`${process.env.REDIRECT_URL_BASE}/`)
          }

          console.log('✅ Session saved, user authenticated:', user._id)
          res.redirect(`${process.env.REDIRECT_URL_BASE}/dashboard`)
        })
      })
    })(req, res, next)
  },

  // Google OAuth callback route after Google redirects back
  googleCallback: (req, res) => {
    console.log('googleCallback fired')
    // After successful login, redirect to user page
    res.redirect(`${process.env.REDIRECT_URL_BASE}/dashboard`)
  },

  // Route to log the user out
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
      res.redirect(`${process.env.REDIRECT_URL_BASE}/`)
    })
  },
}
