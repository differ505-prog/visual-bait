require('dotenv').config({ path: '.env.local' });
const { storeLead } = require('./lib/redis.ts'); 
// Wait, lib/redis.ts is typescript. Let's use ts-node or just write the logic.
