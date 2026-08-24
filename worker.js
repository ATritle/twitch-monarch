export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Anyone can check the current Monarch
    if (url.pathname === "/current") {
      const username = await env.MONARCH_KV.get("currentMonarch");

      if (!username) {
        return new Response("There is currently no Monarch.", {
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          }
        });
      }

      return new Response(`@${username} is the current Monarch.`, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Cache-Control": "no-store"
        }
      });
    }

    // Only Nightbot should be able to set the Monarch
    if (url.pathname === "/set") {
      const token = url.searchParams.get("token");

      if (!token || token !== env.SET_TOKEN) {
        return new Response("Unauthorized.", {
          status: 401
        });
      }

      let username = url.searchParams.get("username") || "";

      username = username.replace(/^@/, "").trim();

      if (!username) {
        return new Response("No username provided.", {
          status: 400
        });
      }

      // Basic Twitch username validation
      if (!/^[A-Za-z0-9_]{1,25}$/.test(username)) {
        return new Response("Invalid Twitch username.", {
          status: 400
        });
      }

      await env.MONARCH_KV.put("currentMonarch", username);

      return new Response(
        `@${username} is now the current Monarch.`,
        {
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    return new Response("Twitch Monarch API is running.", {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      }
    });
  }
};
