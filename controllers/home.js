module.exports = {
  getHealth: (req, res) => {
    console.log('waking up')
    res.send('ok')
  },
  showError: (req, res) => {
    console.log(req.body)
  },
  getIndex: (req, res) => {
    return res.json(req.user)
  },
}
