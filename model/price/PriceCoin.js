const mongoose = require('mongoose');
const priceSchema = new mongoose.Schema({
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
    time:{
        type:Date,
        default:Date.now()
    },
    
})
const PriceCoin = mongoose.model('PriceCoin',priceSchema);
module.exports = {PriceCoin}