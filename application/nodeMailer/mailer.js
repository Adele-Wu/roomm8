var nodemailer = require('nodemailer');
require('dotenv').config();
EmailUserName=process.env.EmailUserName;
EmailPassword=process.env.EmailPassword;
let transporter =nodemailer.createTransport({
  host: "roomm8.net",
  port: 465,
  secure: true,
  auth: {
    user: EmailUserName,
    pass: EmailPassword
  },
  tls:
  {
    rejectUnauthorized:false
  }
});
console.log(EmailUserName)
console.log(EmailPassword);
function sendMail(email,Username,message)
{
  transporter.sendMail({
    from: '"Message Courier" <"messagecourier@roomm8.net>', // sender address
    to: email, // list of receivers
    subject: "Message from"+Username, // Subject line
    text: message
  });
}