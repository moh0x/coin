const { User } = require("../../model/User");
const { Coin } = require("../../model/Coin");
const { Transform } = require("../../model/transformation/Transfomr");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constant/httpStatus');
const { Trade } = require("../../model/trade/Trade");
const { Agent } = require("../../model/agent/Agent");
const { PriceCoin } = require("../../model/price/PriceCoin");

const createTradeSell = async(req,res)=>{
    try {
        const token = req.headers.token;
        const valid = validationResult (req);
        const count = req.body.count; 
        const priceOneCoin = req.body.priceCoin;
        const price = count * priceOneCoin;
        const senderUser = await User.findOne({token:token});
        const coin = await Coin.findOne({name:"Moh"})
  if (valid.isEmpty()) {
    console.log(priceOneCoin);
    
    if (count > 0 && count <= 10000 && priceOneCoin > 0) {
        if (senderUser.coin >= count) {
            if (senderUser.dollars >= 0.25) {
                const newDollars = senderUser.dollars - 0.25;
                const newCoin = senderUser.coin - count;
                const newEarn = coin.earn + 0.25;
                await Coin.findByIdAndUpdate(coin.__v,{
                    $set:{
                        earn:newEarn
                    }
                });
                await coin.save();
                await User.findByIdAndUpdate(senderUser._id,{
                    $set:{
                        dollars:newDollars,
                        coin:newCoin
                    }
                });
                await senderUser.save();
                const newTrade =  new Trade({
                    userNameSender:senderUser.userName,
                    senderId:senderUser._id,
                    count:count,
                    price:price,
                    priceOneCoin:priceOneCoin,
                    reciverId:null
        
                });
                await newTrade.save();
                res.status(200).json({"status":httpsStatus.SUCCESS,data:newTrade});
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
        console.log(error);
        
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
}
const deleteMyTradeSellOpen = async(req,res)=>{
   try {
    const tradeId= req.body.tradeId;
    const trade = await Trade.findById(tradeId);
    const token = req.headers.token;
    const user = await User.findOne({token:token});
    const valid = validationResult (req);
    if (valid.isEmpty()) {
        if (trade) { 
            
            if (trade.senderId.toString() == user._id.toString()) {
                if (trade.state == "new") {
                   await Trade.findByIdAndDelete(tradeId) ;
                   res.status(200).json({"status":httpsStatus.SUCCESS,data:null});
                } else {
                    res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"trade is finished"});
                }
            } else {
                res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you don't have permission"});
            }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"trade not found or already used"});
        }
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg}); 
         
    }
   } catch (error) {
    console.log(error);
    
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"}); 
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
        if (trade && trade.state == "new") {
            if (trade.senderId.toString() != reciverUser._id.toString()) {
                if (reciverUser.dollars >=trade.price +  0.25) {
                    const newDollarsRecvier = reciverUser.dollars - 0.25;
                    const newCoinsReciver = reciverUser.coin + trade.count;
                    const newEarn = coin.earn + 0.25;
                    let agentFees = 0;
                    const coinTradeLastDay = Number(coin.coinTradeLastDay) + Number(trade.count);
                    const priceAdd = ((trade.priceOneCoin - coin.price)*trade.count)/3000000;
                    const newPrice = coin.price + priceAdd;
                    newPrice.toFixed(10);
                    if (reciverUser.codeAgent != null) {
                        agentFees = trade.price * 0.1;      
                     const agent =    await Agent.findOneAndUpdate({code:reciverUser.codeAgent});
                     const newDollards =  agentFees + agent.dollars;
                     await Agent.findByIdAndUpdate(agent._id,{
                        $set:{
                            dollars:newDollards
                        }
                     })
                        await agent.save()
                    }
                    let percentage =newPrice/coin.price;
                    let per = newPrice > coin.price ? percentage : -percentage
                    await Coin.findByIdAndUpdate(coin._id,{
                        $set:{
                            earn:newEarn,
                            agentFees:agentFees,
                            coinTradeLastDay:coinTradeLastDay,
                            price:newPrice, 
                            percentage: per,
                            up: newPrice > coin.price ? true : false 
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
                    let fees = trade.fees + 0.25
               const newTrade =    await Trade.findByIdAndUpdate(tradeId,{
                        userNameReciver:reciverUser.userName,
                        reciverId:reciverUser._id,
                        state:"finish",
                        fees:fees
                    });
                    await newTrade.save();
                    res.status(200).json({"status":httpsStatus.SUCCESS,data:newTrade});
                 } else {
                    res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you don't have money"});
                 }
            } else {
                res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"you can't buy from your self"});
            }
         } else {
            res.status(400).json({"status":httpsStatus.FAIL,data:null,"message":"trade not found or already used"});
         }
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg}); 
    }
    } catch (error) {
        console.log(error);
        
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
    const page = req.headers.page || 1;
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
    const page = req.headers.page || 1;
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
    const page = req.headers.page || 1;
    const skip = (page - 1) * limit;
     try {
      var token =  req.headers.token;
      const user = await User.findOne({token:token});
        const trades = await Trade.find({$and:[{senderId:{$ne: user._id}},{state:"new"}]}).sort({time:-1}).limit(limit).skip(skip); 
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":trades}); 
     } catch (error){
        console.log(error);
        
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     }
  }
  module.exports ={createTradeSell,buyCoin,getMyTradesSell,getMyTradesBuy,getMyTradesSellOpen,getAllTradesSell,deleteMyTradeSellOpen}