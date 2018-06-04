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
  let {bT, shippo} = req.body;
  // let itemsBought=bT.customFields.shopperCart;
  // let boughtItems = [];
  // // let boughtItems = itemsBought.map((item, index)=>{
  // //    let quantityOrdered = item.quantityOrdered;
  // //     let companyName = item.companyName;
  // //     let productName = item.productName;
  // //     let productPrice = item.productPrice;
  // //     console.log(productName);
  // //     <div key={index}>
  // //           <li>Quantity: {quantityOrdered} | Product: {companyName} {productName} | Price: {productPrice}</li>
  // //         </div>;
  // //   });

  // for(let i=0; i<=itemsBought.length-1; i++){
  //   let object = {}
  // }

  let mailOptions = {
    from:' "RoseCityShopperUSA"<rosecityshopperUSA@gmail.com>',
    to: 'rosecityshopperUSA@gmail.com',
    subject: `PURCHASE ALERT #${bT.id}`,
    text: 'We sold something!',
    html: 
    `<b>
        <h1>Order #${bT.id} placed</h1>
        <h3>Shipping Details</h3>
        <ul>
          <li>Shipping Label: ${shippo.label_url}</li>
          <li>Shipping Tracking Number: ${shippo.tracking_number}</li>
          <li>Shipping Tracking Provider URL: ${shippo.tracking_url_provider}</li>
        </ul>
        <h3>What we sold</h3>
        <ul>
          <p>Under Construction...please look at mLab for now</p>

        </ul>
        <h3>Where we will be shipping to</h3>
        <ul>
          <li>Name: ${bT.shipping.firstName} ${bT.shipping.lastName}</li>
          <li>Address: ${bT.shipping.streetAddress} ${bT.shipping.extendedAddress}</li>
          <li>City/Locality: ${bT.shipping.locality}</li>
          <li>State/Region: ${bT.shipping.region}</li>
          <li>Zipcode: ${bT.shipping.postalCode}</li>
          <li>Country: ${bT.shipping.countryName}</li>
        </ul>
    </b>`

  };
  transporter.sendMail(mailOptions, function(err,info){
    if(err)
      console.log(err)
      else
        console.log(info);
  });
});

// let itemsBought = this.props.bT.customFields.shopperCart;
//     let boughtItems = itemsBought.map((item,index)=>{
//       let quantityOrdered = item.quantityOrdered;
//       let companyName = item.companyName;
//       let productName = item.productName;
//       let productPrice = item.productPrice;
//       console.log(productName);
//       return (<div key={index}>
//             <li>Quantity: {quantityOrdered} | Product: {companyName} {productName} | Price: {productPrice}</li>
//           </div>);
//     });

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