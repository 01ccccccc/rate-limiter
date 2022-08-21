// create connection, Create a Redis instance
require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
  retryStrategy() {
    const delay = 5000;
    return delay;
  },
  maxRetriesPerRequest: 1,
});

module.exports = redis;
