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
      console.log("received xread stream2:backend: ", xread);
      const { name, messages } = xread[0]!;
      console.log("messages: ", messages);
      const { id, message } = messages[0];

      console.log("calling resolve");
      this.callbacks[message.tradeId]!(message.updatedBalance);
      return;
    }
  };

  waitForMessage = (callbackId: string) => {
    return new Promise((resolve, reject) => {
      console.log("inside WaitForMessage before resolve and reject");
      this.callbacks[callbackId] = resolve;
      setTimeout(() => {
        if (this.callbacks[callbackId]) {
          reject();
        }
      }, 5000);
    });
  };
}
