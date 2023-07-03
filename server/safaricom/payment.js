import axios from "axios";
import { Router } from "express";
import generate_Time_stamp from "../helper.js";
import { Token_Gnerator } from "./paymentHelpers.js";
import * as dotenv from "dotenv";
dotenv.config();

// ! generate timestamp
const Timestamp = generate_Time_stamp();
// ! generate password
const password = btoa(
  process.env.SHORT_CODE + process.env.PASS_KEY + Timestamp
);

export const Payment_Route = Router();
let tpks;
Payment_Route.post(
  "/api/messpayment/mpesa",
  Token_Gnerator,
  async (req, res) => {
    // !user information
    const { phone, amount } = req.body;
    const token = res.Authorization.access_token;
    console.log(token);
    await axios
      .post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

        {
          BusinessShortCode: process.env.SHORT_CODE,
          Password: password,
          Timestamp: Timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: "1",
          // PartyA: 254790504636,
          PartyA: 254792626899,
          PartyB: process.env.SHORT_CODE,
          // PhoneNumber: 254790504636,
          PhoneNumber: 254792626899,
          CallBackURL:
            "https://65d1-41-89-227-171.ngrok-free.app/callback/result",
          AccountReference: "Test",
          TransactionDesc: "Test",
        },
        //   header
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((results) => {
        console.log(results.data);
        tpks = token;
        res.json(results.data);
        const checkoutId = results.data.CheckoutRequestID;

        // ! transaction status
        axios
          .post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
            {
              BusinessShortCode: 174379,
              Password: password,
              Timestamp: Timestamp,
              CheckoutRequestID: checkoutId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((data) => {
            console.log(data);
          });
      })
      .catch((err) => {
        console.log(err.data);
      });
  }
);
