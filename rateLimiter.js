const redis = require('./cache');
const moment = require('moment');

const fixedWindowCounter = async (req, res, next) => {
  console.log('fixed Window Counter triggered!');
  let userIp =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

  console.log('userIp: ', userIp);

  if ((await redis.incr(`IP:${userIp}:fixed`)) <= 10) {
    redis.expire(`IP:${userIp}:fixed`, 1, 'NX');
    console.log('野貓騎士來囉');
    return next();
  } else {
    console.log('有人攻擊村莊');
    return res.status(429).json({ error: 429, message: '你攻擊我的村莊？' });
  }
};

const slidingLogs = async (req, res, next) => {
  console.log('sliding Logs triggered!');
  let userIp =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

  let now = moment().format('x');
  let windowSize = 1000;
  let rateLimit = 10;
  let uniqueString = Math.random() * 1000;
  let luaScript = `local ip = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local unique = tonumber(ARGV[4])
  local clearBefore = now - window
  redis.call('ZREMRANGEBYSCORE', ip, 0, clearBefore)
  local amount = redis.call('ZCARD', ip)

  if amount <= limit then
  redis.call('ZADD', ip, now, unique)
  end

  redis.call('EXPIRE', ip, window)
  return limit - amount`;

  redis.defineCommand('slidingLogs', {
    numberOfKeys: 1,
    lua: luaScript,
  });

  redis.slidingLogs(
    `IP:${userIp}`,
    now,
    windowSize,
    rateLimit,
    uniqueString,
    (err, result) => {
      if (err !== null) {
        console.log('lua err: ', err);
      }
      if (result >= 0) {
        console.log('野貓騎士來囉');
        // console.log('result: ', result);
        return next();
      }
      // console.log('result: ', result);
      console.log('有人攻擊村莊');
      return res.status(429).json({ error: 429, message: '你攻擊我的村莊？' });
    }
  );
};

const slidingWindowCounter = async (req, res, next) => {
  let userIp =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

  let now = moment().valueOf();
  console.log('sliding window counter triggered!', now);
  let threshold = 10;
  let windowSize = 1000;

  let luaScript = `local ip = KEYS[1]
  local now = tonumber(ARGV[1])
  local windowSize = tonumber(ARGV[2])
  local threshold = tonumber(ARGV[3])   
  local currentWindow = math.floor(now/1000)
  local prev_count = 0
  local cur_count = 0

  local prev_req = redis.call('get', ip .. tostring(currentWindow-1))
  if prev_req then
    prev_count = prev_req
  end
  local curr_req = redis.call('get', ip .. tostring(currentWindow))
  if curr_req then
  cur_count = curr_req
  end

  local last_contribute = windowSize - (now - currentWindow * 1000);
  local ec = (prev_count * (last_contribute / windowSize)) + cur_count + 1
  if ec <= threshold then 
    redis.call('incr', ip .. tostring(currentWindow))
    redis.call('expire', ip .. tostring(currentWindow), 2, 'NX')
    return 0
  else
    return ec .. " " .. prev_count .. " " .. cur_count
  end
  `;

  redis.defineCommand('slidingLogs', {
    numberOfKeys: 1,
    lua: luaScript,
  });

  redis.slidingLogs(
    `IP:${userIp}`,
    now,
    windowSize,
    threshold,
    (err, result) => {
      if (err) {
        console.log('lua error: ', err);
        return err;
      }
      console.log('result: ', result);
      if (result === 0) {
        console.log('野貓騎士來囉');
        return next();
      }
      console.log('有人攻擊村莊');
      return res.status(429).json({ error: 429, message: '你攻擊我的村莊？' });
    }
  );
};

module.exports = { fixedWindowCounter, slidingLogs, slidingWindowCounter };
