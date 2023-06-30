import mongoose from "mongoose";
const TransactionSchema=mongoose.Schema

const transaction= new TransactionSchema({
    Amount:Number,
    MpesaReceiptNumber:String,
    TransactionDate:Number,
    PhoneNumber:Number,

},{
    collection:'transactions'
})

export const Transaction_collection=mongoose.model('transactions',transaction)
