const mongoose = require('mongoose');
const depositSchema = new mongoose.Schema({
    price:{
        type:Number,
        required:true,
    },
   senderId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
   },
   userNameSender:{
    type:String,
    required:true,
    default:"      ",
    minlength:6,
    maxlength:30
   },
   time:{
    type:Date,
    default:Date.now()
   },
   state:{
    type:String,
    default:"new",
    minlength:3,
    maxlength:10
   },
   txId:{
    type:String,
    required:true,
    minlength:1,
    maxlength:88
   },
   reciverWallet:{
    Type:String
   },
   senderWallet:{
    Type:String
   }
})
const Deposit = mongoose.model('Deposit',depositSchema);
module.exports = {Deposit}
