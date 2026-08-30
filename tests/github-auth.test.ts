import { describe, expect, it } from "vitest";

describe("GitHub upload credential", () => {
  it.skipIf(!process.env.GITHUB_TOKEN)("authenticates against GitHub without exposing the token", async () => {
    const token = process.env.GITHUB_TOKEN;
    expect(token).toBeTruthy();
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "truthtext-ai-open-source-publisher",
      },
    });
    expect(response.ok).toBe(true);
    const user = await response.json() as { login?: string };
    expect(user.login).toBeTruthy();
  }, 15000);
});
