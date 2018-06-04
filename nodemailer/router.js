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
  let {bT, shippo} = req.body;
  

  let mailOptions = {
    from:' "RoseCityShopperUSA"<rosecityshopperUSA@gmail.com>',
    to: `${bT.customFields.billingEmail}`,
    subject: `Thanks for your purchase! #${bT.id}`,
    text: 'RoseCityShopperUSA Receipt',
    html: 
    `<b>
        <h1>Thank you so much for your purchase today!</h1>
        <p>Below we have some details related to your purchase.</p>
        <h2>Order #${bT.id}</h2>

        <h3>Shipping Details</h3>
        <ul>
          <li>Shipping Tracking Number: ${shippo.tracking_number}</li>
          <li>Shipping Tracking Provider URL: ${shippo.tracking_url_provider}</li>
        </ul>
        <h3>What we sold</h3>
        <ul>
          <p>Under Construction...please look at mLab for now</p>

        </ul>
        <h3>The shipping address you gave us:</h3>
        <ul>
          <li>Name: ${bT.shipping.firstName} ${bT.shipping.lastName}</li>
          <li>Address: ${bT.shipping.streetAddress}</li>
          <li>Ext. Address: ${bT.shipping.extendedAddress}</li>
          <li>City/Locality: ${bT.shipping.locality}</li>
          <li>State/Region: ${bT.shipping.region}</li>
          <li>Zipcode: ${bT.shipping.postalCode}</li>
          <li>Country: ${bT.shipping.countryName}</li>
        </ul>
        <h3>Who got billed:</h3>
        <ul>
          <li>Name: ${bT.billing.firstName} ${bT.billing.lastName}</li>
          <li>Address: ${bT.billing.streetAddress}</li> 
          <li>Ext. Address ${bT.billing.extendedAddress}</li>
          <li>City/Locality: ${bT.billing.locality}</li>
          <li>State/Region: ${bT.billing.region}</li>
          <li>Zipcode: ${bT.billing.postalCode}</li>
          <li>Country: ${bT.billing.countryName}</li>
        </ul>
        <h3>Money Details</h3>
        <ul>
          <li>Cost of Product(s): ${bT.customFields.itemCost} ${bT.currencyIsoCode}</li>
          <li>Shipping Method Cost: ${bT.customFields.shippingMethodCost} ${bT.currencyIsoCode}</li>
          <li>Service Fees: ${bT.customFields.serviceFees} ${bT.currencyIsoCode}</li>
          <li>GRAND TOTAL: ${bT.amount} ${bT.currencyIsoCode}</li>
        </ul>

        <p>If you have any issues, please email us at <a href='mailto:rosecityshopperUSA@gmail.com?Subject=${bT.id}' target="_top">rosecityshopperUSA@gmail.com</a></p>


    </b>`

  };
  transporter.sendMail(mailOptions, function(err,info){
    if(err)
      console.log(err)
      else
        console.log(info);
  });
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
        <h3>Where we will be shipping to:</h3>
        <ul>
          <li>Name: ${bT.shipping.firstName} ${bT.shipping.lastName}</li>
          <li>Address: ${bT.shipping.streetAddress}</li>
          <li>Ext. Address: ${bT.shipping.extendedAddress}</li>
          <li>City/Locality: ${bT.shipping.locality}</li>
          <li>State/Region: ${bT.shipping.region}</li>
          <li>Zipcode: ${bT.shipping.postalCode}</li>
          <li>Country: ${bT.shipping.countryName}</li>
        </ul>
        <h3>Who we billed:</h3>
        <ul>
          <li>Name: ${bT.billing.firstName} ${bT.billing.lastName}</li>
          <li>Address: ${bT.billing.streetAddress}</li>
          <li>Ext. Address: ${bT.billing.extendedAddress}</li>
          <li>City/Locality: ${bT.billing.locality}</li>
          <li>State/Region: ${bT.billing.region}</li>
          <li>Zipcode: ${bT.billing.postalCode}</li>
          <li>Country: ${bT.billing.countryName}</li>
        </ul>
        <h3>Money Details</h3>
        <ul>
          <li>Cost of Product(s): ${bT.customFields.itemCost} ${bT.currencyIsoCode}</li>
          <li>Shipping Method Cost: ${bT.customFields.shippingMethodCost} ${bT.currencyIsoCode}</li>
          <li>Service Fees: ${bT.customFields.serviceFees} ${bT.currencyIsoCode}</li>
          <li>GRAND TOTAL: ${bT.amount} ${bT.currencyIsoCode}</li>
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