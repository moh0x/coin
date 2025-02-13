const mongoose = require('mongoose');
const transformSchema = new mongoose.Schema({
    fees:{
        required:true,
        type:Number,
        default:0.25
    },
    count:{
        type:Number,
        required:true,
    },
   senderId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
   },
   reciverId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
   },
   userNameSender:{
    type:String,
        required:true,
        minlength:6,
        maxlength:30
   },
   userNameReciver:{
    type:String,
        required:true,
        minlength:6,
        maxlength:30
   },
   time:{
    type:Date,
    default:Date.now()
   }
})
const Transform = mongoose.model('Transform',transformSchema);
module.exports = {Transform}