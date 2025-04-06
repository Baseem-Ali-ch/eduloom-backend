import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export default redisClient;