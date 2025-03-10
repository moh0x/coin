const mongoose = require('mongoose');
const express = require("express");
const port = 3000;
const app = express();
app.use(express.json());
const cors = require('cors')
app.use(cors())
app.listen(port,()=>{
    console.log('connected');  
})
const userRoute = require('./routes/userRoute');
app.use('/api/users/',userRoute)
const tradeRoute = require('./routes/trade/tradeRoute');
app.use('/api/trades/',tradeRoute)
const coinRoute = require('./routes/coin/CoinRoutes');
app.use('/api/coin/',coinRoute)
const tranRoute = require('./routes/deposit and withdraw/depAndWithRouter');
app.use('/api/transction/',tranRoute)
const dbUrl = "mongodb+srv://moh:PANDA@cluster0.vrauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUrl).then(()=>console.log('db connected')).catch((e)=>console.log('failed db'));

