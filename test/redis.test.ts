import Redis from "ioredis";

describe("Belajar NodeJS Redis using Ioredis", () => {
  let redis: Redis;
  beforeEach(() => {
    redis = new Redis({
      host: "localhost",
      port: 6379,
      db: 0,
    });
  });
  afterEach(async () => {
    await redis.quit();
  });

  it("should can ping", async () => {
    const pong = await redis.ping();
    expect(pong).toBe("PONG");
  });
  it("should support string", async () => {
    await redis.setex("name", 2, "Eko");
    const nameExists = await redis.get("name");
    expect(nameExists).toBe("Eko");
    await new Promise((resolve, _reject) => setTimeout(resolve, 3000));
    const nameExpired = await redis.get("name");
    expect(nameExpired).toBeNull();
  });
});
