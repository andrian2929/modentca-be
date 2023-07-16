const nodemailer = require('nodemailer')
const env = require('./env')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_ADDRESS,
    pass: env.EMAIL_PASSWORD
  }
})

console.log(env.EMAIL_ADDRESS, env.EMAIL_PASSWORD)

module.exports = transporter
