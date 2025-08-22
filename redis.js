const {createClient}  = require('redis');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;

const client = createClient({
    username: process.env.REDIS_USER_NAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-14937.c89.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 14937,
        connectTimeout: 10000, // 10 seconds timeout
        lazyConnect: true
    }
});

let isRedisConnected = false;

client.on('error', (error)=>{
    console.log('Redis Error:', error.message);
    isRedisConnected = false;
})

client.on('connect', ()=>{
     console.log('Connecting to redis...');
})

client.on('ready', ()=>{
    console.log('Redis is connected and ready');
    isRedisConnected = true;
})

client.on('end', ()=>{
    console.log('Redis connection ended');
    isRedisConnected = false;
})

// Connect to Redis with better error handling
async function connectRedis() {
    try {
        await client.connect();
        console.log('Redis connection successful');
    } catch (err) {
        console.log('Failed to connect to Redis:', err.message);
        console.log('Application will continue without Redis rate limiting');
    }
}

connectRedis();


// Create rate limiter with Redis store
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
  }),
  windowMs: 5*60*1000, // 5 minutes
  max: 5,
  // Remove custom keyGenerator to use default (which handles IPv6 properly)
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.',
  },
  // Skip rate limiting if Redis is not connected
  skip: (req) => {
    if (!isRedisConnected) {
      console.log('Redis not connected, skipping rate limiting for:', req.ip);
      return true;
    }
    return false;
  }
});


module.exports = {limiter}