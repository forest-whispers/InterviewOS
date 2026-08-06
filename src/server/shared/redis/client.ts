import { redis } from "@/server/config/redis";

export async function pingRedis() {
  try {
    await redis.set("redis:healthcheck", "ok", { ex: 30 });
    const value = await redis.get<string>("redis:healthcheck");
    return value === "ok";
  } catch (error) {
    console.error("Redis ping failed:", error);
    return false;
  }
}