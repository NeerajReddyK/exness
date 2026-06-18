
import {createClient} from "redis";
export const redisClient = createClient({socket: {host: "localhost", port:6379}});

