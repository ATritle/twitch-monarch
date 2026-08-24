export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Anyone can check the current Monarch
    if (url.pathname === "/current") {
      const username = await env.MONARCH_KV.get("currentMonarch");

      if (!username) {
        return new Response("There is currently no Monarch.", {
          headers: { "Content-Type": "text/plain" }
        });
      }

      return new Response(`@${username} is the current Monarch.`, {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Set the Monarch
    if (url.pathname === "/set") {
      const username = url.searchParams.get("username");

      if (!username) {
        return new Response("No username provided.", {
          status: 400
        });
      }

      const cleanUsername = username.replace(/^@/, "").trim();

      await env.MONARCH_KV.put("currentMonarch", cleanUsername);

      return new Response(
        `@${cleanUsername} is now the current Monarch.`,
        {
          headers: { "Content-Type": "text/plain" }
        }
      );
    }

    return new Response("Twitch Monarch API is running.");
  }
};
