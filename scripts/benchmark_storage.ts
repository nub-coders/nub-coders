import { MemStorage } from "../server/storage";
import { performance } from "perf_hooks";

async function benchmark() {
  const storage = new MemStorage();
  const userCount = 10000;
  const iterations = 1000;

  console.log(`Populating storage with ${userCount} users...`);
  for (let i = 0; i < userCount; i++) {
    await storage.createUser({
      username: `user${i}`,
      password: "password",
    });
  }

  console.log(`Running benchmark with ${iterations} iterations...`);
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const username = `user${Math.floor(Math.random() * userCount)}`;
    await storage.getUserByUsername(username);
  }
  const end = performance.now();

  const totalTime = end - start;
  const averageTime = totalTime / iterations;

  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per lookup: ${averageTime.toFixed(4)}ms`);
}

benchmark().catch(console.error);
