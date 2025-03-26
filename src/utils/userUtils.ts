var CryptoJS = require('crypto-js')
import { env } from '../config/env'
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

// export const hashPassword = async (password: string) => {
//   const salt = await bcrypt.genSalt(10)
//   return await bcrypt.hash(password, salt)
// }
// export const checkPassword = async (
//   enteredPassword: string,
//   storedHash: string,
// ) => {
//   return await bcrypt.compare(enteredPassword, storedHash)
// }
