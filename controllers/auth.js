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
    passport.authenticate('google', {
      failureRedirect: 'https://myharada.netlify.app/', // Redirect if authentication fails
      successRedirect: 'https://myharada.netlify.app/dashboard', // Redirect to user page after successful login
    })(req, res, next)
  },

  // Google OAuth callback route after Google redirects back
  googleCallback: (req, res) => {
    // After successful login, redirect to user page
    res.redirect('https://myharada.netlify.app/')
  },

  // Route to log the user out
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('https://myharada.netlify.app/')
    })
  },
}
