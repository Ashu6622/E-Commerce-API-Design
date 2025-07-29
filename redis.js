const {createClient}  = require('redis');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;

const client = createClient({
    username: process.env.REDIS_PASSWORD,
    password: process.env.REDIS_USER_NAME,
    socket: {
        host: 'redis-14937.c89.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 14937
    }
});



client.on('error', (error)=>{
    console.log(error);
})

client.on('connect', ()=>{
     console.log('Connecting to redis');
})

client.on('ready', ()=>{
    console.log('Redis is connected')
})

client.connect().catch((err)=> console.log('Failed to connect to Redis:', err.message))


const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
  }),
  windowMs: 60*1000, // 1 minutes
  max: 5,
  keyGenerator: (req, res) =>{
        //  console.log(req.ip + req.path);
        return req.ip + req.path
  },
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.',
  },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => false,
//   onLimitReached: (req, res, optionsUsed) => {
//     console.warn(`Rate limit exceeded for IP ${req.ip}`);
//   }
});

module.exports = {client, limiter}