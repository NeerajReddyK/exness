import { createClient, type RedisClientType } from "redis";

export class RedisSubscriber {
  private client: RedisClientType;
  private callbacks: Record<string, (value?: unknown) => void>;

  constructor() {
    this.client = createClient();
    if (!this.client.isOpen) {
      this.client.connect();
    }
    this.callbacks = {};
    this.runLoop();
  }

  runLoop = async () => {
    while (1) {
      const xread = await this.client.xRead(
        {
          key: "stream2:backend",
          id: "$",
        },
        { BLOCK: 0, COUNT: 1 },
      );
      if (!xread) continue;
      console.log("in runLoop after !xread: ", xread);
      const { messages } = xread[0]!;
      const { message } = messages[0];
      console.log("messages: ", messages);
      console.log("xread from redisSubscriber: ", xread);

      console.log("callbacks before resolving: ", this.callbacks);
      console.log(
        "callback that is being called to resolve: ",
        message.tradeId,
      );
      this.callbacks[message.tradeId]!(message.updatedBalance);
      console.log("callback that is being removed: ", message.tradeId);
      delete this.callbacks[message.tradeId];
      console.log("callbacks after resolving: ", this.callbacks);
    }
  };

  waitForMessage = (callbackId: string) => {
    console.log("inside waitForMessage for ", callbackId);
    return new Promise((resolve, reject) => {
      this.callbacks[callbackId] = resolve;
      setTimeout(() => {
        if (this.callbacks[callbackId]) {
          console.log("calling reject");
          console.log("callbacks before: ", this.callbacks);
          delete this.callbacks[callbackId];
          console.log("callback after: ", this.callbacks);
          reject();
        }
      }, 5000);
    });
  };
}
