module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log('AUTHENTICATED')
      return next()
    } else {
      console.log('NOT AUTHENTICATED')
      res.redirect('https://myharada.netlify.app')
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('https://myharada.netlify.app')
    } else {
      return next()
    }
  },
}
