const Redis = require('ioredis')
const env = require('./env')

const redisClient = new Redis(env.REDIS_URL)

redisClient.on('connect', () => {
  console.log('Redis client connected')
})

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error)
})

module.exports = redisClient
