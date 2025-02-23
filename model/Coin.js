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
        default:0.0005
    },
    count:{
        type:Number,
        default:1000000000
    },
    used:{
        type:Number,
<<<<<<< HEAD
   
    },
    earn:{
        type:Number,
      
    },
    agentFees:{
        type:Number,
    
    },
    coinTradeLastDay:{
    Type:Number,
  }
=======

    },
    earn:{
        type:Number,

    },
    agentFees:{
        type:Number,

    },
    coinTradeLastDay:{
    Type:Number,

    }
>>>>>>> 67aad90f1cb8ea06f253cab1730a9924b7a6dd74
})
const Coin = mongoose.model('Coin',coinSchema);
module.exports = {Coin}
