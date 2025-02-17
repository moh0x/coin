const { User } = require("../../model/User");
const { Coin } = require("../../model/Coin");
const { Transform } = require("../../model/transformation/Transfomr");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constant/httpStatus');
const { Trade } = require("../../model/trade/Trade");
const createTradeSell = async(req,res)=>{
    try {
        const token = req.headers.token;
        const valid = validationResult (req);
        const count = req.body.count;
        const price = req.body.price;
        const priceOneCoin = req.body.priceOneCoin;
        const senderUser = await User.findOne({token:token});
        const coin = await Coin.findOne({name:"Moh"})
  if (valid.isEmpty()) {
    if (count > 0 && count <=10000) {
        if (senderUser.coin >= count) {
            if (senderUser.dollars >= 0.25) {
                const newDollars = senderUser.dollars - 0.25;
                const newEarn = coin + 0.25;
                await Coin.findByIdAndUpdate(coin.__v,{
                    $set:{
                        earn:newEarn
                    }
                });
                await coin.save();
                await User.findByIdAndUpdate(senderUser._id,{
                    $set:{
                        dollars:newDollars
                    }
                });
                await senderUser.save();
                const newTrade =  new Trade({
                    userNameSender:senderUser.userName,
                    senderId:senderUser._id,
                    count:count,
                    price:price,
                    priceOneCoin:priceOneCoin
        
                });
                await newTrade.save();
             } else {
                res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"0.25$ to open trade"});
             }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you don't have coins"});
        }
      } else {
        res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"min is 0 and max is 10000"});
      }
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
  }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
}

const buyCoin = async(req,res)=>{
    try {
        const token = req.headers.token;
        const tradeId = req.body.tradeId;
        const valid = validationResult (req);
        const reciverUser = await User.findOne({token:token});
        const trade = await Trade.findById(tradeId);
        const coin = await Coin.findOne({name:"Moh"})
    if (valid) {
        if (trade) {
            if (trade.senderId != reciverUser._id) {
                if (reciverUser.dollars >=trade.price +  0.25) {
                    const newDollarsRecvier = reciverUser.dollars - 0.25;
                    const newCoinsReciver = reciverUser.coin + trade.count;
                    const newEarn = coin.earn + 0.25;
                    const agentFees = 0;
                    const coinTradeLastDay = coin.coinTradeLastDay + trade.count;
                    const priceAdd = ((trade.price - coin.price)*trade.count)/3000000;
                    const newPrice = coin.price + priceAdd;
                    newPrice.toFixed(10);
                    if (reciverUser.codeAgent != null) {
                        agentFees = trade.price * 0.1;
                        agentFees.toFixed(2);
                    }
                    await Coin.findByIdAndUpdate(coin._id,{
                        $set:{
                            earn:newEarn,
                            agentFees:agentFees,
                            coinTradeLastDay:coinTradeLastDay,
                            price:newPrice
                        }
                    });
                    await coin.save();
                    await User.findByIdAndUpdate(reciverUser._id,{
                        $set:{
                            dollars:newDollarsRecvier,
                            coin:newCoinsReciver
                        }
                    });
                    await reciverUser.save();
                    const senderUser = await User.findById(trade.senderId);
                    const newCoinsSender = senderUser.coin - trade.count;
                    await User.findByIdAndUpdate(senderUser._id,{
                        $set:{
                            coin:newCoinsSender
                        }
                    });
                    await senderUser.save();
                   await Trade.findByIdAndUpdate(tradeId,{
                        userNameReciver:reciverUser.userName,
                        reciverId:reciverUser._id,
                        state:"finish"
                    });
                    await newTrade.save();
                 } else {
                    res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you don't have money"});
                 }
            } else {
                res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you con't buy from your self"});
            }
         } else {
            res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"trade not found"});
         }
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg}); 
    }
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
} 

const getMyTradesSell = async(req,res)=>{
    const limit = 15;
    const page = req.headers.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const trades = await Trade.find({senderId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":trades}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  const getMyTradesBuy = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const trades = await Trade.find({reciverId:user._id}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":trades}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  const getMyTradesSellOpen = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const trades = await Trade.find({senderId:user._id,state:"new"}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":trades}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }

  const getAllTradesSell = async(req,res)=>{
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const trades = await Trade.find({$and:[{senderId:{$ne: user._id}},{reciverId:"      "},{state:"new"}]}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":trades}); 
     } catch (error){
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  module.exports ={createTradeSell,buyCoin,getMyTradesSell,getMyTradesBuy,getMyTradesSellOpen,getAllTradesSell}
