const cors = require("cors");const express=require('express');const app=express();app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://garage-business.vercel.app"
    ],
    credentials: true
  })
);
require('dotenv').config();app.get('/',(_,res)=>res.send('OK'));app.listen(4000);
