const redis = require("redis");
const redisClient = redis.createClient();

async function initRedis() {
    redisClient.on("error", (err) => console.log("❌ Redis Client Error:", err));
    redisClient.on("ready", () => console.log("✅ Redis client started"));

    try {
        await redisClient.connect();
        console.log("🎯 Redis Connected Successfully!");
    } catch (error) {
        console.log("❌ Redis Connection Failed:", error);
    }

    await redisClient.ping();
}

module.exports = { initRedis, redisClient };
