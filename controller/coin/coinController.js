const { User } = require("../../model/User");
const { Coin } = require("../../model/Coin");
const { Transform } = require("../../model/transformation/Transfomr");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constant/httpStatus');
const { Agent } = require("../../model/agent/Agent");
const { PriceCoin } = require("../../model/price/PriceCoin");
const addUserCode =async(req,res)=>{
    try {
        const valid = validationResult(req);
    
        
        if (valid.isEmpty()) {
            const token = req.headers.token; 
            const user = await User.findOne({token:token});
            const coin = await Coin.findOne({name:"Moh"});
            const codeUser = req.body.codeUser;
            const userCode = await User.findOne({code:codeUser});
          
         if (userCode) {
            const userCodeDolladrs = userCode.dollars;
            if (user.codeUser == null) {
                if (user.code.toLowerCase() != codeUser.toLowerCase()) {
                    if (userCode.affilate < 3) {
                        const userNewDollars= user.dollars + 1;
                        await User.findByIdAndUpdate(user._id,{
                            $set:{
                                codeUser:codeUser,
                                dollars:userNewDollars
                            }
                        })
                        let newAffilate = userCode.affilate + 1;
                        if (newAffilate == 3) {
                           let userCodeDollars = userCodeDolladrs + 1;
                           await User.findByIdAndUpdate(userCode._id,{
                               $set:{
                                   affilate:newAffilate,
                                   dollars:userCodeDollars
                               }
                               
                           })
                           await user.save();
                           await userCode.save();
                           res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
                        }else{
                           await User.findByIdAndUpdate(userCode._id,{
                               $set:{
                                   affilate:newAffilate,
                               }
                               
                           })
                        }
                        let newPrice =  coin.price + 0.000001;
                        let percentage =newPrice/coin.price;
                        let per = newPrice > coin.price ? percentage : -percentage
                        await Coin.findByIdAndUpdate(coin._id,{
                            $set:{
                              price:newPrice,
                              percentage: per,
                              up: newPrice > coin.price ? true : false
                            }
                          })
                          await coin.save();
                       
                        res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
                       } else {
                           res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"max is 3"});
                       } 
                } else {
                    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"don't use your code"});
                }
             } else {
                res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"just 1 time"});
             }
            } else {
                res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no user with this code"});
            }
         } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
         }
    } catch (error) {
      
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
}
const addAgentCode =async(req,res)=>{
    try {
        const token = req.headers.token;
        const valid = validationResult(req);
        if (valid.isEmpty()) {
            const codeAgent = req.body.codeAgent;
            const agent = await Agent.findOne({code:codeAgent});
            const user = await User.findOne({token:token});
            const coin = await Coin.findOne({name:"Moh"});
        if (agent) {
            if (user.codeAgent == null) {      
                const userNewDollars= user.dollars + 1;
                await User.findByIdAndUpdate(user._id,{
                    $set:{
                        codeAgent:codeAgent,
                        dollars:userNewDollars
                    }
                })
                    let newAffilate = agent.affilate + 1;
                       await Agent.findByIdAndUpdate(agent._id,{
                           $set:{
                               affilate:newAffilate,
                           }
                           
                       })
                       await user.save();
                       let newPrice =  coin.price + 0.000001;
                       let percentage =newPrice/coin.price;
                       let per = newPrice > coin.price ? percentage : -percentage
                       await Coin.findByIdAndUpdate(coin._id,{
                           $set:{
                             price:newPrice,
                             percentage: per,
                             up: newPrice > coin.price ? true : false
                           }
                         })
                         await coin.save();
                       await agent.save();
                       res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
                    res.status(200).json({"status":httpsStatus.SUCCESS,"data":null});
             } else {
                res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"just 1 time"});
             }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no agent with this code"});
        }
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
    } catch (error) {
        console.log(error);
        
        res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
    }
}
const getCoin = async (req,res) => {
    try {
       const coin = await Coin.findOne({name:"Moh"}) ;
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":coin})
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"})
    }
}
module.exports ={addUserCode,addAgentCode,getCoin}
