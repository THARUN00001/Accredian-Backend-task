var createError = require('http-errors');
var express = require('express');
var referRoute = require("./routes/refer")
var { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const env = require('dotenv')
env.config();

var app = express();
var cors = require('cors')

app.use(cors())




app.use(express.json());

app.use(express.urlencoded({ extended: false }));



app.use('/', referRoute);


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });



app.listen(process.env.PORT, "localhost")
app.on('listening', () => {
  console.log("listening on port"+process.env.PORT);
})

module.exports = app;
