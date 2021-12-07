require('dotenv').config();
let aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-2" });
function sesTest(emailTo, emailFrom, message, name) {
    var params = {
      Destination: {
        ToAddresses: [emailTo]
      },
      Message: {
        Body: {
          Text: { Data: "From Contact Form: " + name + "\n " + message }
        },
  
        Subject: { Data: "From: " + emailFrom }
      },
      Source: "messageCurrior@roomm8.net"
    };
  
    return ses.sendEmail(params).promise().then(function(sucess)
    {
        console.log(sucess);
    }).catch(function(error)
    {
        console.log(error);
    });
  }