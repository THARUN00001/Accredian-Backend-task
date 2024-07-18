var createError = require('http-errors');
var express = require('express');
var referRoute = require("./routes/refer")
var { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const env = require('dotenv')
env.config();
const port = process.env.PORT || 4000;
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



app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
