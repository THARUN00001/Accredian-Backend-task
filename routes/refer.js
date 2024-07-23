var { PrismaClient } =  require('@prisma/client')


const prisma = new PrismaClient()
var express = require('express');
var router = express.Router();

const path = require("path");



const ejs = require("ejs");
var app = express();
app.set('view engine', 'ejs');
const renderFile = require("../public/javascript/sendEmail.js");



router.post('/', async function (req, res, next) {

    try {
        const refer = req.body;
        console.log(refer);
        await addReferals(refer);
        res.status(200).send('Referral added and email sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }


});

async function addReferals(refer) {
    try {
        
        const data = {
            refereeName: refer.RefereeUsername,
            referrerName: refer.ReferrerUsername,
        }
        renderFile( data, refer)
// console.log(refer);
     
        refer.ReferrerEmail = refer.ReferrerEmail.toLowerCase();
        refer.RefereeEmail = refer.RefereeEmail.toLowerCase();
        var user = await prisma.user.findFirst({
            where: { email: refer.ReferrerEmail }
        });
console.log(refer.ReferrerEmail );
console.log(refer.RefereeUsername );
        if (!user) {

            const u = await prisma.user.create({
                data: {
                    email: refer.ReferrerEmail,
                    username: refer.ReferrerUsername,

                },
            });



            await prisma.referral.create({
                data: {
                    referrer: {
                        connect: { user_id: u.user_id }
                    },

                    referee_email: refer.RefereeEmail,
                    referee_username: refer.RefereeUsername
                },
            });


        } else {

            await prisma.referral.create({
                data: {
                    referrer: {
                        connect: { user_id: user.user_id }
                    },

                    referee_email: refer.RefereeEmail,
                    referee_username: refer.RefereeUsername
                },
            });
        }

  

  



    } catch (err) {
        console.log(err);
    }
}





module.exports = router;
