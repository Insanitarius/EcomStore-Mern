import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  useEffect(() => {}, [reload]);

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products.map((p) => {
      amount += p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isAuthenticated().token}`,
    };
    return fetch(`${API}/stripepayment/${userId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        //TODO: Payment Processing

        const { status } = response;
        console.log(status);
        if (status === 200) {
          //   const orderData = {
          //     products: products,
          //     transaction_id: response.transaction.id,
          //     amount: response.transaction.amount,
          //   };
          //   console.log(response.transaction.id);
          //   console.log(response.transaction.amount);
          //   createOrder(userId, token, orderData);
          cartEmpty(() => {
            console.log("Did we got a crash?");
          });

          setReload(!reload);
        }
      })
      .catch((err) => {
        setData({ loading: false, success: false });
        console.log("PAYMENT FAILED");
        console.log(err);
      });
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      //getFinalPrice() !== 0 &&
      <StripeCheckoutButton
        stripeKey={process.env.REACT_APP_SECRETPK}
        token={makePayment}
        amount={getFinalPrice() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">
          Sign in to proceed for payment!
        </button>
      </Link>
    );
  };

  return (
    getFinalPrice() !== 0 && (
      <div>
        <h3 className="text-white">Total Amount = $ {getFinalPrice()}</h3>
        {showStripeButton()}
      </div>
    )
  );
};

export default StripeCheckout;
