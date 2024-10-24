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
  it("should support sorted set", async () => {
    await redis.zadd("names", 100, "eko");
    await redis.zadd("names", 85, "budi");
    await redis.zadd("names", 95, "joko");
    const zLength = await redis.zcard("names");
    const zData = await redis.zrange("names", 0, -1);
    expect(zLength).toBe(3);
    expect(zData).toEqual(["budi", "joko", "eko"]);
    const zMax = await redis.zpopmax("names");
    const zMin = await redis.zpopmin("names");
    expect(zMax).toEqual(["eko", "100"]);
    expect(zMin).toEqual(["budi", "85"]);
    await redis.del("names");
  });
  it("should support hashes", async () => {
    await redis.hset("user_one", {
      id: "1",
      name: "eko",
      email: "eko@mail.com",
    });
    const user_one = await redis.hgetall("user_one");
    const user_one_email = await redis.hget("user_one", "email");
    expect(user_one).toEqual({
      id: "1",
      name: "eko",
      email: "eko@mail.com",
    });
    expect(user_one_email).toBe("eko@mail.com");
    await redis.del("user_one");
  });
});
