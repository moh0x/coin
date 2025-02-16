const mongoose = require('mongoose');
const coinSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:"Moh"
    },
    price:{
        required:true,
        type:Number,
        default:0.0001
    },
    count:{
        type:Number,
        default:1000000000
    },
    used:{
        type:Number,
        default:0
    },
    earn:{
        type:Number,
        default:0
    },
    agentFees:{
        type:Number,
        default:0
    },
    coinTradeLastDay:{
    Type:Number,
    default:0}
})
const Coin = mongoose.model('Coin',coinSchema);
module.exports = {Coin}