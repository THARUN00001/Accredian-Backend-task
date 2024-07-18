var { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
var router = express.Router();

const path = require("path");

const fs = require("fs")
const template = fs.readFileSync("../public/email-templet.ejs", "utf8");
const ejs = require("ejs");
var app = express();
app.set('view engine', 'ejs');
const renderFile = require("../public/javascript/sendEmail.js");



router.post('/', async function (req, res, next) {

    try {
        const refer = req.body;
        await addReferals(refer);
        res.status(200).send('Referral added and email sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }


});

async function addReferals(refer) {
    try {


        var user = await prisma.user.findFirst({
            where: { email: refer.ReferrerEmail }
        });

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

            const referee = await prisma.referral.create({
                data: {
                    referrer: {
                        connect: { user_id: user.user_id }
                    },

                    referee_email: refer.RefereeEmail,
                    referee_username: refer.RefereeUsername
                },
            });
        }

  

        const data = {
            refereeName: refer.RefereeUsername,
            referrerName: refer.ReferrerUsername,
        }

        renderFile( data, refer)

    } catch (err) {
        console.log(err);
    }
}





module.exports = router;
