import { redis } from "@/server/config/redis";

export async function appendToList<T>(
    key: string,
    value: T,
    ttlSeconds?: number
): Promise<boolean> {
    try {
        await redis.rpush(
            key,
            JSON.stringify(value)
        );

        if (ttlSeconds) {
            await redis.expire(
                key,
                ttlSeconds
            );
        }

        return true;
    } catch (error) {
        console.error(
            `Redis RPUSH failed for key "${key}"`,
            error
        );

        return false;
    }
}

export async function getList<T>(
    key: string
): Promise<T[]> {
    try {
        const values =
            await redis.lrange(
                key,
                0,
                -1
            );

        return values.map((value) =>
            JSON.parse(value)
        ) as T[];
    } catch (error) {
        console.error(
            `Redis LRANGE failed for key "${key}"`,
            error
        );

        return [];
    }
}

export async function trimList(
    key: string,
    start: number,
    stop: number
): Promise<boolean> {
    try {
        await redis.ltrim(
            key,
            start,
            stop
        );

        return true;
    } catch (error) {
        console.error(
            `Redis LTRIM failed for key "${key}"`,
            error
        );

        return false;
    }
}

export async function deleteList(
    key: string
): Promise<boolean> {
    try {
        await redis.del(key);

        return true;
    } catch (error) {
        console.error(
            `Redis list delete failed for key "${key}"`,
            error
        );

        return false;
    }
}