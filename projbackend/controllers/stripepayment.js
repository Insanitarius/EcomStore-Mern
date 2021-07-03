const stripe = require("stripe")(process.env.SK);
const uuid = require("uuid/v4");
const { Order } = require("../models/order");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);
  //
  //req.body.order.user = req.profile;
  const orderData = {
    products: products,
    user: req.profile,
  };
  let order = new Order(orderData);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order in DB",
      });
    }
    //res.json(order);
  });
  //
  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });
  const idempotencyKey = uuid();

  //TODO: Charges
  // try {
  //   const customer = stripe.customers.create({
  //     email: token.email,
  //     source: token.id,
  //   });
  //   if (customer) {
  //     const charges = stripe.charges.create(
  //       {
  //         amount: amount * 100,
  //         currency: "usd",
  //         customer: customer.id,
  //         receipt_email: token.email,
  //         description: `Purchased the product`,
  //         shipping: {
  //           name: token.card.name,
  //           address: {
  //             line1: token.card.address_line1,
  //             line2: token.card.address_line2,
  //             city: token.card.address_city,
  //             country: token.card.address_country,
  //             postal_code: token.card.address_zip,
  //           },
  //         },
  //       },
  //       {
  //         idempotencyKey,
  //       }
  //     );
  //     console.log(charges);
  //     console.log(customer);
  //     res.json(charges);
  //   }
  // } catch (err) {
  //   console.error(err);
  // }

  //XXX
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased the product`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          {
            idempotencyKey,
          }
        )
        .then((result) => {
          res.status(200).json({ result });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};
