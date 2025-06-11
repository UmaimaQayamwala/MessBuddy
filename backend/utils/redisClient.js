










const redis = require("redis");

// ✅ Create Redis Client (move this outside function to avoid redefinition)
const redisClient = redis.createClient({
  username: 'default',
  password: 'XDN4PxvuMRnLICTnB0yFq7IWc75VwyvS',
  socket: {
    host: 'redis-14777.c14.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 14777
  }
});

// ✅ Handle connection errors
redisClient.on('error', err => {
  console.error('❌ Redis Client Error:', err);
});

// ✅ Connection state
let isConnected = false;

// ✅ Initialize connection (only once)
async function initRedis() {
  if (!isConnected) {
    try {
      await redisClient.connect();
      isConnected = true;
      console.log('✅ Redis Connected Successfully');
      

    } catch (err) {
      console.error('❌ Redis Connection Failed:', err);
    }
  }
}

module.exports = { initRedis, redisClient };

