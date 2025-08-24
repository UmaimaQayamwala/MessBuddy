const redis = require("redis");

const redisClient = redis.createClient({
  username: "default",
  password: "XDN4PxvuMRnLICTnB0yFq7IWc75VwyvS",
  socket: {
    host: "redis-14777.c14.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 14777,
  },
});

redisClient.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

let isConnected = false;

async function initRedis() {
  if (!isConnected) {
    try {
      await redisClient.connect();
      isConnected = true;
      console.log(" Redis Connected Successfully");
    } catch (err) {
      console.error(" Redis Connection Failed:", err);
    }
  }
}

module.exports = { initRedis, redisClient };
