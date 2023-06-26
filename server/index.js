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

// ! authentication is base 64 encoding of secretkey and consumer key

const authentication = btoa(
  `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRETE}`
);
console.log(authentication);

// !middle ware to geenarete the token

const Token_Gnerator = async (req, res, next) => {
  await axios .get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
    headers:{
      Authorization:`Basic ${authentication}`
    }
  }).then(data=>{
    res.Authorization=data.data
  })
  next();
};
// !listen to the server


app.post('/callback',(req,res)=>{

  console.log(req.body)
 
})
app.post("/home",Token_Gnerator, (req, res) => {
  res.json({result:res.Authorization });


});

app.post("/api/messpayment/mpesa",Token_Gnerator, async (req, res) => {
  // !user information
  const { phone, amount } = req.body;
  const token=res.Authorization.access_token
  console.log(token)
  axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

      {
        "BusinessShortCode": process.env.SHORT_CODE,    
   "Password": password,    
   "Timestamp":Timestamp,    
   "TransactionType": "CustomerPayBillOnline",    
   "Amount": "1",    
   "PartyA":254792626899,    
   "PartyB":process.env.SHORT_CODE,    
   "PhoneNumber":254792626899,    
   "CallBackURL": "https://239b-41-89-227-171.ngrok-free.app/callback",    
   "AccountReference":"Test",    
   "TransactionDesc":"Test",
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
