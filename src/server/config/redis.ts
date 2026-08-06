import { Redis } from "@upstash/redis";
import { env } from "./env";

const url = env.UPSTASH_REDIS_REST_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN;

export const redis = new Redis({
  url,
  token,
});