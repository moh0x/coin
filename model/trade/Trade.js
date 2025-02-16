const mongoose = require('mongoose');
const tradeSchema = new mongoose.Schema({
    fees:{
        required:true,
        type:Number,
        default:0.25
    },
    count:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    priceOneCoin:{
        type:Number,
        required:true,
    },
   senderId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
   },
   reciverId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
    default:"      "
   },
   userNameSender:{
    type:String,
    required:true,
    default:"      ",
    minlength:6,
    maxlength:30
   },
   userNameReciver:{
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
   }
})
const Trade = mongoose.model('Trade',tradeSchema);
module.exports = {Trade}