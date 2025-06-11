const express = require("express");

const { connectDB } = require("./utils/connectDB");
const { middlewareConfig } = require("./middleware/middlewareConfig");
const { configEnv } = require("./configs/configEnv");
const { configRoutes } = require("./routes/configRoutes");
const { initRedis } = require("./utils/redisClient");

const app = express();


// config env (dotenv)
configEnv();    

// cors, express.json
middlewareConfig(app);



 const port=process.env.PORT ||8000 
// connect to db
connectDB();
initRedis();

// routes
configRoutes(app);

app.get("/",(req,res)=>
{
  return res.json({
    sucess:true,
    message:"sucessfully deployed"
  })
})

app.listen(port, ()=>{
    console.log("Backend server is running");
});