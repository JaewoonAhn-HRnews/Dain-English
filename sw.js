const C='dain-kid-v4';
const CORE=['./','index.html'];
const EXTRA=['manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{
  await c.addAll(CORE).catch(()=>c.add('./').catch(()=>{}));
  await Promise.all(EXTRA.map(f=>c.add(f).catch(()=>{})));   // 아이콘이 없어도 설치는 계속
}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){ e.respondWith(fetch(e.request).then(r=>{ if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));} return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')).then(r=>r||caches.match('./')))); }
  else if(u.hostname.includes('fonts.')){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res;}))); }
});
