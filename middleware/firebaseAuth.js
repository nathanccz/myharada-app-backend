const { admin, waitForFirebase } = require('../config/firebaseAdmin')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (req.isAuthenticated && req.isAuthenticated() && !token) {
    // User is authenticated via Passport
    return next()
  }

  if (!token && (!req.isAuthenticated || !req.isAuthenticated())) {
    console.log('Failed to authenticate via passport')
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const ready = await waitForFirebase()

    if (!ready) {
      return res.status(400).json({ message: 'Firebase not ready.' })
    }

    const decodedToken = await admin.auth().verifyIdToken(token)

    // Find or create the MongoDB user
    let user = await User.findOne({
      authProviderId: decodedToken.uid,
    })

    if (!user) {
      // Create user if first time
      user = await User.create({
        authProviderId: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
      })
    }

    // Attach the MongoDB user (just like Passport does!)
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: error })
  }
}

module.exports = { authenticate }
