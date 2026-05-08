import { describe, it, expect, beforeEach } from "bun:test";
import { MemStorage } from "./storage";

describe("MemStorage", () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it("should create and retrieve a user by ID", async () => {
    const userData = { username: "testuser", password: "password" };
    const user = await storage.createUser(userData);

    expect(user.id).toBeDefined();
    expect(user.username).toBe(userData.username);

    const retrievedUser = await storage.getUser(user.id);
    expect(retrievedUser).toEqual(user);
  });

  it("should retrieve a user by username", async () => {
    const userData = { username: "testuser", password: "password" };
    const user = await storage.createUser(userData);

    const retrievedUser = await storage.getUserByUsername(userData.username);
    expect(retrievedUser).toEqual(user);
  });

  it("should return undefined for non-existent user ID", async () => {
    const user = await storage.getUser(999);
    expect(user).toBeUndefined();
  });

  it("should return undefined for non-existent username", async () => {
    const user = await storage.getUserByUsername("nonexistent");
    expect(user).toBeUndefined();
  });

  it("should increment user IDs", async () => {
    const user1 = await storage.createUser({ username: "user1", password: "p1" });
    const user2 = await storage.createUser({ username: "user2", password: "p2" });

    expect(user2.id).toBe(user1.id + 1);
  });
});
