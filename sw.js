self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const pathname = location.pathname.split('/').filter(Boolean);
  const repo = pathname.length > 0 ? `/${pathname[0]}/` : '/';
  if (url.pathname === repo && url.searchParams.has("url")) {
    const site = url.searchParams.get("url");
    const proxyURL = `https://proxy.ckoglu.workers.dev/?url=${encodeURIComponent(site)}`;
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(proxyURL);
          const html = await res.text();
          return new Response(html, {headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": "inline"}});
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {headers: { "Content-Type": "application/json; charset=utf-8" }, status: 500});
        }
      })()
    );
  }
});
