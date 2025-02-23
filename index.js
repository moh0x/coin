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
const dbUrl = "mongodb+srv://moh:PANDA@cluster0.vrauc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
server.listen(3001, () => {
    console.log('listening on *:3001');
  });
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
mongoose.connect(dbUrl).then(()=>console.log('db connected')).catch((e)=>console.log('failed db'));
// login user
