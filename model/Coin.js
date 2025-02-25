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
   
    },
    earn:{
        type:Number,
      
    },
    agentFees:{
        type:Number,

    },
    coinTradeLastDay:{
    Type:Number,
    },
    percentage:{
        Type:Number,
    },
    up:{
        Type:Boolean,
    }

})
const Coin = mongoose.model('Coin',coinSchema);
module.exports = {Coin}

