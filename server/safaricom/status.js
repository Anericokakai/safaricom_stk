import {Router} from 'express'

export const callBack_route=Router()
callBack_route.post("/callback/result", async(req, res) => {
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
  
    }
  });
  






 