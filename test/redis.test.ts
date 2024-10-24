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
    await redis.setex("name", 1, "Eko");
    const nameExists = await redis.get("name");
    expect(nameExists).toBe("Eko");
    await new Promise((resolve, _reject) => setTimeout(resolve, 2000));
    const nameExpired = await redis.get("name");
    expect(nameExpired).toBeNull();
  });
  it("should support list", async () => {
    await redis.rpush("names", "eko");
    await redis.rpush("names", "kurniawan");
    await redis.rpush("names", "khannedy");
    const namesLength = await redis.llen("names");
    expect(namesLength).toBe(3);
    const allNames = await redis.lrange("names", 0, -1);
    expect(allNames).toEqual(["eko", "kurniawan", "khannedy"]);
    const firstNamePopped = await redis.lpop("names");
    expect(firstNamePopped).toBe("eko");
    const secondNamePopped = await redis.rpop("names");
    expect(secondNamePopped).toBe("khannedy");
    const lastLength = await redis.llen("names");
    expect(lastLength).toBe(1);
    await redis.del("names");
  });
  it("should support set", async () => {
    await redis.sadd("names", "eko");
    await redis.sadd("names", "kurniawan");
    await redis.sadd("names", "khannedy");
    await redis.sadd("names", "eko");
    await redis.sadd("names", "kurniawan");
    await redis.sadd("names", "khannedy");
    const setLength = await redis.scard("names");
    const allSets = await redis.smembers("names");
    expect(setLength).toBe(3);
    expect(allSets).toEqual(["eko", "kurniawan", "khannedy"]);
    await redis.del("names");
  });
});
