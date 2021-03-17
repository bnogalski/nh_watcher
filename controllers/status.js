
const io = require('../utils/socket');

exports.gitRigs = (req, res, next) => {
  res.status(200).json({
    date: new Date().toString()
  })
}
