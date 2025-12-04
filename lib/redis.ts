import { Redis } from "@upstash/redis"

// Singleton Redis client for high-performance atomic operations
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  }
  return redis
}

// Helper function to get workshop availability from Redis
export async function getWorkshopAvailability(workshopId: string): Promise<number | null> {
  const redis = getRedisClient()
  const key = `workshop:${workshopId}:available`
  return await redis.get<number>(key)
}

// Helper function to initialize workshop quota in Redis
export async function initializeWorkshopQuota(workshopId: string, quota: number): Promise<void> {
  const redis = getRedisClient()
  const key = `workshop:${workshopId}:available`
  await redis.set(key, quota)
}

// Atomic decrement for workshop registration (returns remaining seats)
export async function decrementWorkshopQuota(workshopId: string): Promise<number> {
  const redis = getRedisClient()
  const key = `workshop:${workshopId}:available`
  return await redis.decr(key)
}

// Increment for cancellation
export async function incrementWorkshopQuota(workshopId: string): Promise<number> {
  const redis = getRedisClient()
  const key = `workshop:${workshopId}:available`
  return await redis.incr(key)
}
