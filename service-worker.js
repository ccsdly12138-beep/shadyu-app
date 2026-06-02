const CACHE_NAME = "english-app-v2"; // 每次修改服务工作线程，建议把版本号顺手加1（v1 -> v2）

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./", 
        "./index.html", 
        "./manifest.json",
        // 🔴 把 Supabase 的远程 CDN 地址也缓存下来，这样离线也能加载 JS
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    }),
  );
});
