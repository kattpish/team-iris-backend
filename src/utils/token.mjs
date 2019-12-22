import jwt from 'jsonwebtoken'
const jwtSecret = process.env.JWT_SECRET

export function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (error, token) => {
      if (error) reject(error)
      else resolve(token)
    })
  })
}

export function parseToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) reject(error)
      else resolve(decoded)
    })
  })
}
