module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      // User is authenticated, continue
      return next()
    } else {
      // API request → respond with JSON and 401
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Non-API request (optional) → redirect for normal browser navigation
      return res.redirect('/login')
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      // API request → respond with JSON to indicate already logged in
      if (req.originalUrl.startsWith('/api')) {
        return res.status(200).json({ message: 'Already authenticated' })
      }

      // Non-API request → redirect to dashboard
      return res.redirect('/dashboard')
    } else {
      // Guest user, continue
      return next()
    }
  },
}
