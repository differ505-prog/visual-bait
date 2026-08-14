require('dotenv').config({ path: '.env.local' });
const { Redis } = require('@upstash/redis');
console.log("URL:", process.env.KV_REST_API_URL);
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
redis.ping().then(console.log).catch(console.error);
