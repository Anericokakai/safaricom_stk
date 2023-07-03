import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

import express from "express";
import generate_Time_stamp from "./helper.js";
import cors from "cors";
import { Payment_Route } from "./safaricom/payment.js";
import { Ussd_Route } from "./ussd/ussd.js";
import { callBack_route } from "./safaricom/status.js";
// ! app configuration


const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ! listen for payment
app.use(Payment_Route)

// !sdd route fro paymnet
app.use(Ussd_Route)


// !listen to callback 
app.use(callBack_route)



app.get("/", (req, res) => {
  res.json({ status: 200 });
});
app.listen(process.env.PORT, () => {
  console.log(`app listening at port ${process.env.PORT}`);
});


