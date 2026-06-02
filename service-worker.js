const CACHE_NAME = "english-app-v3";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];
// CDN 单独列出，缓存失败不影响主流程
const CDN_ASSETS = [
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 先缓存本地文件（必须成功）
      await cache.addAll(STATIC_ASSETS);
      // CDN 单独处理，失败不阻断安装
      for (const url of CDN_ASSETS) {
        try {
          await cache.add(url);
        } catch(e) {
          console.warn("CDN 缓存失败，跳过:", url);
        }
      }
    })
  );
  self.skipWaiting(); // 立即激活新版本
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // 删除旧版本缓存
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // 立即接管所有页面
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
