import axios from "axios";
import * as dotenv from 'dotenv'
dotenv.config()

const authentication = btoa(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRETE}`
  );


  

 export const Token_Gnerator = async (req, res, next) => {
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
  
 
  