const ejs = require("ejs");
const nodemailer = require("nodemailer");
const templatePath = "public/email-templet.ejs";
function renderFile( data, refer) {


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EailID, 
            pass: process.env.SMTP_Mail_password 
        }
    });



    ejs.renderFile(templatePath, data, (err, html) => {
        if (err) {
            console.error(err);
        } else {


            let mailOptions = {
                from: process.env.SMTP_EailID,
                to: refer.RefereeEmail, 
                subject: 'Referal invite!!', 

                html: html // HTML body
            };


            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s to ', refer.RefereeEmail + info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });


        }
    });
}


module.exports = renderFile;