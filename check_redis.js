const { Redis } = require('@upstash/redis');
require('dotenv').config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function main() {
  const tenant = await redis.get('tenant:chuangjiabao');
  console.log(JSON.stringify(tenant.story, null, 2));
}
main();
