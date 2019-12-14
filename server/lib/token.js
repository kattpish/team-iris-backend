const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

// 토큰 생성
function generateToken (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (error, token) => {
      if (error) {
        reject(error)
      }
      resolve(token)
    })
  })
}

exports.generateToken = generateToken
