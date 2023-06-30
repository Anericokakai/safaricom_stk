import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

import express from "express";
import generate_Time_stamp from "./helper.js";
import cors from "cors";
// ! app configuration

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// !call  time stamp helper
const Timestamp = generate_Time_stamp();

// !generate password from short code passkey and  and time stamp

const password = btoa(
  process.env.SHORT_CODE + process.env.PASS_KEY + Timestamp
);
console.log({ password: password });

// ! authentication is base 64 encoding of secretkey and consumer key

const authentication = btoa(
  `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRETE}`
);
console.log(authentication);
console.log(Timestamp);

// !middle ware to geenarete the token

const Token_Gnerator = async (req, res, next) => {
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authentication}`,
        },
      }
    )
    .then((data) => {
      res.Authorization = data.data;
    });
  next();
};
// !listen to the server

app.post("/callback", (req, res) => {
  console.log(req.body);
});
app.post("/home", Token_Gnerator, (req, res) => {
  res.json({ result: res.Authorization });
});

let tpks;
app.post("/api/messpayment/mpesa", Token_Gnerator, async (req, res) => {
  // !user information
  const { phone, amount } = req.body;
  const token = res.Authorization.access_token;
  console.log(token);
  axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

      {
        BusinessShortCode: process.env.SHORT_CODE,
        Password: password,
        Timestamp: Timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: 254792626899,
        PartyB: process.env.SHORT_CODE,
        PhoneNumber: 254792626899,
        CallBackURL: "https://65d1-41-89-227-171.ngrok-free.app/result",
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
      tpks=token
      res.json(results.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.json({ status: 200 });
});
app.listen(process.env.PORT, () => {
  console.log(`app listening at port ${process.env.PORT}`);
});
app.post("/result", async(req, res) => {
  console.log(req.body);
  if (req.body.Body.stkCallback.ResultCode === 2001) {
    console.log("invalid user information");
  } else if (req.body.Body.stkCallback.ResultCode === 17) {
    console.log("internal error");
  } else if(req.body.Body.stkCallback.ResultCode === 1032){
    console.log('request cancelled by the user')
  }else {
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item[0].Value);
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item[1].Value);
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item[3].Value);
    console.log(req.body.Body.stkCallback.CallbackMetadata.Item[4].Value);

   // ! transaction status
   await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        "BusinessShortCode": 174379 ,
        "Password":password,
        "Timestamp": Timestamp,
        "CheckoutRequestID":req.body.Body.stkCallback.CheckoutRequestID
    },
      {
        headers: {
          Authorization:`Bearer ${tpks}`
    
        },
      }
    ).then(data=>{
      console.log(data)
    })
  }
});


