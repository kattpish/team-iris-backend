import jwt from 'jsonwebtoken'
const jwtSecret = process.env.JWT_SECRET

export default function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (error, token) => {
      if (error) {
        reject(error)
      }
      resolve(token)
    })
  })
}
