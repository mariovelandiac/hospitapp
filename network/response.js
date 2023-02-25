const response = {
  success: function (req, res, message = '', status = 200) {
    res.status(status).json({
      error: false,
      status: status,
      body: message
    })
  },
  error: function (req, res, message = 'Internal Server Error', status = 500) {
    res.status(status).json({
      error: true,
      status: status,
      body: message
    })
  }
}

module.exports = {response}
