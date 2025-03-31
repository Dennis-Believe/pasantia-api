import { env } from '../../../config/env'
var CryptoJS = require('crypto-js')
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import { Context } from 'hono';
import { randomUUID } from 'crypto';



export const encryptPassword = async (password: string) => {
  var hashedPassword = await CryptoJS.AES.encrypt(password, env.key).toString()
  return hashedPassword
}
export const decryptPassword = async (password: string) => {
  var bytes = CryptoJS.AES.decrypt(password,env.key);
  var decryptedPassword = await bytes.toString(CryptoJS.enc.Utf8)
  return decryptedPassword
}

export const generateTokenOtb = () => Math.floor(100000 + Math.random() * 900000).toString();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmail_user,
    pass: env.gmail_pass,
  },
})
export async function sendEmail(email: any, token: any) {
  try {
    const info = await transporter.sendMail({
      from: env.gmail_user,
      to: email,
      subject: 'CODIGO DE AUTENTICACION',
      text: token.toString(),
    })
    return 'ok'
  } catch (error: any) {
    return error.message
  }
}
export async function generateJWT(userId:string,sessionId:string) {

    const payload = { userId: userId, sessionId: sessionId};
    const secret = env.key || 'secret_key';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    return token
}
export async function verifyJwtToken(token:string)
{
    const secret = env.key || 'secret_key';
    return jwt.verify(token, secret);
}

export function generateUniqueId(): string {
  return randomUUID();
}
export function generateExpirationDate()
{
  const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const year = expirationDate.getFullYear();
      const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
      const day = String(expirationDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`; 
      return formattedDate
}
