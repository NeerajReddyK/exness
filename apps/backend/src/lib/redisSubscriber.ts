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
      const { messages } = xread[0]!;
      const { message } = messages[0];

      this.callbacks[message.tradeId]!(message.updatedBalance);
      delete this.callbacks[message.tradeId];
    }
  };

  waitForMessage = (callbackId: string) => {
    console.log("inside waitForMessage for ", callbackId);
    return new Promise((resolve, reject) => {
      this.callbacks[callbackId] = resolve;
      setTimeout(() => {
        if (this.callbacks[callbackId]) {
          delete this.callbacks[callbackId];
          reject();
        }
      }, 5000);
    });
  };
}
