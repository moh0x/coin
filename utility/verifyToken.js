var jwt = require('jsonwebtoken');
const verifyToken = (req, res, next)=> {
    let token = req.headers.token;
    if (token) {
      jwt.verify(token, `token`, (err, decoded)=> {
        if (err) {
          res.status(400).json({ "success": false, "message": "Failed to authenticate user." })
        } else {
          
          next()
        }
      })
    } else {
      res.status(400).send({ "success": false, "message": "No Token Provided." })
    }
  }
  module.exports = {verifyToken};