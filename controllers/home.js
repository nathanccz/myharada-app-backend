module.exports = {
  getHealth: (req, res) => {
    console.log('waking up')
    res.send('ok')
  },
  getIndex: (req, res) => {
    return res.json(req.user)
  },
}
