
import {createClient} from "redis";
export const redisClient = createClient({socket: {host: "localhost", port:6379}});

if(!redisClient.isOpen) {
    await redisClient.connect();
}