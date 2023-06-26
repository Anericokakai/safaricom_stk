import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

import Express from "express";
import generate_Time_stamp from "./helper.js";
import cors from "cors";
// ! app configuration

const app = Express();
dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// !call  time stamp helper
const Timestamp = generate_Time_stamp();

// !generate password from short code passkey and  and time stamp

const password = new Buffer.from(
  process.env.SHORT_CODE + process.env.PASS_KEY + Timestamp
).toString("base64");

// ! authentication is base 64 encoding of secretkey and consumer key

const authentication = new Buffer.from(
  `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRETE}`
);
// !middle ware to geenarete the token
let token;
const Token_Gnerator = async (req, res, next) => {
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization:`Basic ${authentication}`,
        },
      }
    )
    .then((results) => {
      console.log(results);
      // token = results.data.access_token;
      // !call the next
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
// !listen to the server


app.post('/api',Token_Gnerator,(req,res)=>{


})

app.post("/api/messpayment/mpesa", async (req, res) => {
  // !user information
  const { phone, amount } = req.body;
  axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

      {
        BusinessShortCode: process.env.SHORT_CODE,
        Password: password,
        Timestamp: Timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: 254792626899,
        PartyB: process.env.SHORT_CODE,
        PhoneNumber: 254792626899,
        CallBackURL: "https://mydomain.com/b2c/result",
        AccountReference: 254792626899,
        transactionDesc: "testing api",
      },
      //   header
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      console.log(data);
      res.json(data);
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
