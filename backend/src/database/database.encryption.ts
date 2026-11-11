import * as crypto from 'crypto';
import { ValueTransformer } from 'typeorm';

const algorithm = 'aes-256-cbc';
const secretKey = crypto
  .createHash('sha256')
  .update(process.env.DB_ENCRYPT)
  .digest();

const fixedIv = Buffer.alloc(16, 0); 

export const encryption: ValueTransformer = {
  to(value: string): string {
    if (!value) return value;
    const cipher = crypto.createCipheriv(algorithm, secretKey, fixedIv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return fixedIv.toString('hex') + ':' + encrypted;
  },
  from(value: string): string {
    if (!value || !value.includes(':')) return value;
    try {
      const [ivHex, encryptedHex] = value.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      return value; 
    }
  },
};
