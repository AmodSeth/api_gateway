const redis = require('ioredis');
const utils = require('./utils');

const client = redis.createClient({
  port: 6379,
  host: 'redis',
});
client.on('connect', function() {
  console.log('Redis connected.');
});

async function isOverLimit(ip) {
  try {
    const res = await client.incr(ip);
    if (res > utils.getRateLimit().maxRequests) {
      return true;
    }
    await client.expire(ip, utils.getRateLimit().durationInSec);
    return false;
  } catch (err) {
    console.error('isOverLimit: could not increment key');
    throw err;
  }
}

module.exports = {
  isOverLimit,
};
