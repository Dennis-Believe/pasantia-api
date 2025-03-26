var CryptoJS = require('crypto-js')
import { env } from '../config/env'
import nodemailer from 'nodemailer';
// Encrypt
export const encryptPassword = async (password: string) => {
    var hashedPassword = await CryptoJS.AES.encrypt(password, env.key).toString();
    return hashedPassword
}
export const decryptPassword = async (password: string) => {
    var bytes = CryptoJS.AES.decrypt(password)
    var decryptedPassword = await bytes.toString(CryptoJS.enc.Utf8)
    return decryptedPassword
}
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.gmail_user,
      pass: env.gmail_pass,
    },
  });