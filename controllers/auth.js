const express = require('express')
const passport = require('passport')

module.exports = {
  // Route to trigger Google login
  getLogin: (req, res, next) => {
    console.log('hey')
    // Call passport.authenticate() to initiate Google OAuth
    passport.authenticate('google', { scope: ['profile'] })(req, res, next)
  },

  // Route for the callback after Google login attempt
  postLogin: (req, res, next) => {
    console.log('PostLogin fired')
    passport.authenticate('google', {
      failureRedirect: `${process.env.REDIRECT_URL_BASE}/`, // Redirect if authentication fails
      successRedirect: `${process.env.REDIRECT_URL_BASE}/dashboard`, // Redirect to user page after successful login
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
