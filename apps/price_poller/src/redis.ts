// import { redisClient } from "./redisClient.js"


// const test = async () => {
//     const messageId = await redisClient.xAdd("stream1:poller", "*", {SOLUSDT: "201.24"} );
//     console.log("messageId: ", messageId);
//     const xrange = await redisClient.xRange("stream1:poller", "-", "+");
//     console.log("xrange: ", xrange);
// }
// test();