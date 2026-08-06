const APP_PREFIX = "interview-os";

const KEY_VERSION = "v1";

export function makeKey(
    ...parts: Array<string | number>
) {
    return [APP_PREFIX, KEY_VERSION, ...parts].join(":");
}

export const cacheKeys = {
}

export const cachePrefixes = {
}