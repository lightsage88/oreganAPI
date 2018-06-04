const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rosecityshopperUSA@gmail.com',
    pass:'ptdpassword'
  }
})



router.post('/emailCustomer', jsonParser, function(req,res){
  console.log('/emailCustomer running...');
  console.log(req.body);
});

router.post('/emailAdmin', jsonParser, function(req,res){
  console.log('/emailAdmin running...');
  console.log(req.body);
});

// let mailOptions = {
//   from: '"RoseCityShopperUSA"<rosecityshopperUSA@gmail.com>',
//   to: `${billerEmail}`,
//   subject: 'Thanks for your purchase!',
//   text: 'You bought something from our store! Here are the deets',
//   html: 
//   `<b>
//     <h3>Bob Lob Law</h3>
//     <section>${result}</section>
//   </b>`
// };
//     transporter.sendMail(mailOptions, function (err, info) {
//    if(err)
//      console.log(err)
//    else
//      console.log(info);
// });



module.exports = {router};