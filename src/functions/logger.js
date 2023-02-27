const logger = (req, res, next) => {
  console.log(`${req.method} ${req.hostname}${req.path}`)
  next()
  return
}

module.exports = logger