// custom provider value dapat digunakan ketika kita tidak dapat menambahkan @Injectable kepada sebuah function
// biasanya terjadi saat menggunakan library yang mana hanya dapat di-inisialisasi menjadi sebuah value
// contoh MailService adalah kode yg tidak dapat ditambahkan @Injectable karena merupakan sebuah library kode(misalkan)
export class MailService {
  send() {
    console.log('Send email');
  }
}

// mailService yg akan diset menjadi injectable provider pada module
export const mailService = new MailService();
