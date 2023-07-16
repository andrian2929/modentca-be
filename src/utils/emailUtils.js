const transporter = require('../config/email')
const redisClient = require('../config/redis')
const env = require('../config/env')

async function code () {
  let code
  let isExist
  do {
    code = Math.floor(100000 + Math.random() * 900000)
    isExist = await redisClient.get(code)
  } while (isExist)

  return code
}

const sendEmailVerification = async (recipientEmail) => {
  try {
    const verificationcode = await code()
    redisClient.set(verificationcode, recipientEmail, 'EX', 300)
    const options = {
      from: '"Modentca" <modentcaweb@gmail.com>',
      to: recipientEmail,
      subject: 'Modentca Email Verification',
      text: `Your verification code is ${verificationcode}`
    }
    return await transporter.sendMail(options)
  } catch (err) {
    throw new Error(err)
  }
}

const sendPasswordResetCode = async (recipientEmail) => {
  try {
    const resetCode = await code()
    redisClient.set(resetCode, recipientEmail, 'EX', 300)
    const options = {
      from: '"Modentca" <modentcaweb@gmail.com>',
      to: recipientEmail,
      subject: 'Modentca Password Reset',
      text: `Your password reset code is ${resetCode}`
    }
    return await transporter.sendMail(options)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { sendEmailVerification, sendPasswordResetCode }
