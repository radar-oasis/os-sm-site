// Service Worker — offline cache with network-first app code.
const CACHE = 'suishen-os-v15';
const CORE = [
  './ipad.html',
  './ipad-standalone.html',
  './manifest.webmanifest?v=15',
  './app-data.js?v=15',
  './media-config.js?v=15',
  './media-release.json?v=20260720T075011Z-f18bc36f',
  './components/atoms.jsx',
  './components/overview.jsx',
  './components/heatmap.jsx',
  './components/genealogy.jsx',
  './components/works.jsx?v=15',
  './components/timeline.jsx',
  './components/os-window.jsx',
  './components/os-apps.jsx',
  './components/os-desktop.jsx',
  './components/os-app.jsx',
  './components/ipad/atoms.jsx',
  './components/ipad/shell.jsx',
  './components/ipad/atlas.jsx',
  './components/ipad/atlas.standalone.jsx',
  './components/ipad/genealogy.jsx',
  './components/ipad/map.jsx',
  './components/ipad/app.jsx',
  './components/ipad-install-prompt.jsx',
  './components/ipad-install-prompt.standalone.jsx',
  './assets/pocket-temple-anatomy.png',
  './结构图.jpg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './当代款Links/02当代款无尽藏-1.png',
  './当代款Links/02当代款无尽藏-2.png',
  './当代款Links/02当代款无尽藏-3.png',
  './当代款详情拆解/02当代款无尽藏.png',
  './古董款Links/01古董款严净-1.png',
  './古董款Links/01古董款严净-2.png',
  './古董款Links/01古董款严净-3.png',
  './古董款详情拆解/01-古董款严净.png',
  './古董款Links/02古董款释伽殿戒定慧-7.png',
  './古董款Links/02古董款释伽殿戒定慧-3.png',
  './古董款Links/02古董款释伽殿戒定慧-1.png',
  './古董款详情拆解/02古董款释伽殿戒定慧.png',
  './当代款Links/04当代款千手观音:站-1.png',
  './当代款Links/04当代款千手观音:站-2.png',
  './当代款Links/04当代款千手观音:站-3.png',
  './当代款详情拆解/04当代款千手观音:站.png',
  './uploads/古董款/04古董款舍利函塔-3.png',
  './古董款详情拆解/04古董款舍利函塔.png',
  './当代款Links/06当代款文殊殿-1.png',
  './当代款Links/06当代款文殊殿-2.png',
  './当代款Links/06当代款文殊殿-3.png',
  './当代款详情拆解/06当代款文殊殿.png',
  './古董款Links/08古董款绿度母殿-1.png',
  './古董款Links/08古董款绿度母殿-2.png',
  './古董款Links/08古董款绿度母殿-3.png',
  './古董款详情拆解/08古董款绿度母殿.png',
  './古董款Links/12古董款三佛殿长寿三尊版-2.png',
  './古董款Links/12古董款三佛殿长寿三尊版-1.png',
  './古董款Links/12古董款三佛殿长寿三尊版-3.png',
  './古董款详情拆解/12古董款三佛殿长寿三尊版.png',
  './古董款Links/13古董款尸陀林主殿骨雕版-1.png',
  './古董款Links/13古董款尸陀林主殿骨雕版-2.png',
  './古董款Links/13古董款尸陀林主殿骨雕版-3.png',
  './古董款详情拆解/13古董款尸陀林主殿骨雕版.png',
  './古董款Links/14古董款释伽牟尼殿指尖版-1.png',
  './古董款Links/14古董款释伽牟尼殿指尖版-2.png',
  './古董款Links/14古董款释伽牟尼殿指尖版-3.png',
  './古董款详情拆解/14古董款释伽牟尼殿指尖版.png',
  './古董款Links/09古董款观音殿老银款-3.png',
  './古董款Links/09古董款观音殿老银款-2.png',
  './古董款Links/09古董款观音殿老银款-1.png',
  './古董款详情拆解/09古董款观音殿老银款.png',
  './古董款Links/03古董款作明佛母殿-1.png',
  './古董款Links/03古董款作明佛母殿-2.png',
  './古董款Links/03古董款作明佛母殿-3.png',
  './古董款详情拆解/03古董款作明佛母殿.png',
  './古董款Links/15古董款文殊殿珊瑚版-3.png',
  './古董款Links/15古董款文殊殿珊瑚版-4.png',
  './古董款Links/15古董款文殊殿珊瑚版-1.png',
  './古董款详情拆解/15古董款文殊殿珊瑚版.png',
  './古董款Links/11古董款黄财神殿-1.png',
  './古董款Links/11古董款黄财神殿-2.png',
  './古董款Links/11古董款黄财神殿-3.png',
  './古董款详情拆解/11古董款黄财神殿.png',
  './当代款Links/03当代款灵山大佛-1.png',
  './当代款Links/03当代款灵山大佛-2.png',
  './当代款Links/03当代款灵山大佛-3.png',
  './当代款详情拆解/03当代款灵山大佛.png',
  './古董款Links/16古董款三世佛殿千年菩提路-1.png',
  './古董款Links/16古董款三世佛殿千年菩提路-2.png',
  './古董款Links/16古董款三世佛殿千年菩提路-3.png',
  './古董款详情拆解/16古董款三世佛殿千年菩提路.png',
  './古董款Links/17古董款福寿双殿一龛配两卡-1.png',
  './古董款Links/17古董款福寿双殿一龛配两卡-2.png',
  './古董款Links/17古董款福寿双殿一龛配两卡-4.png',
  './古董款详情拆解/17古董款福寿双殿一龛配两卡.png',
  './古董款Links/17古董款福寿双殿一龛配两卡-9.png',
  './古董款Links/04古董款舍利函塔-3.png',
  './古董款Links/04古董款舍利函塔-2.png',
  './当代款Links/07当代款地藏殿-1.png',
  './当代款Links/07当代款地藏殿-2.png',
  './当代款Links/07当代款地藏殿-3.png',
  './当代款详情拆解/07当代款地藏殿.png',
  './当代款Links/05当代款千手观音:坐-1.png',
  './当代款Links/05当代款千手观音:坐-2.png',
  './当代款Links/05当代款千手观音:坐-3.png',
  './当代款详情拆解/05当代款千手观音:坐.png',
  './古董款Links/18古董款七宝佛塔殿-1.png',
  './古董款Links/18古董款七宝佛塔殿-2.png',
  './古董款Links/18古董款七宝佛塔殿-3.png',
  './古董款详情拆解/18古董款七宝佛塔殿.png',
  './当代款Links/13当代款黄财神-1.png',
  './当代款Links/13当代款黄财神-2.png',
  './当代款Links/13当代款黄财神-3.png',
  './当代款详情拆解/13当代款黄财神.png',
  './古董款Links/06古董款华严三圣紫檀的传承-1.png',
  './古董款Links/06古董款华严三圣紫檀的传承-2.png',
  './古董款Links/06古董款华严三圣紫檀的传承-3.png',
  './古董款详情拆解/06古董款华严三圣紫檀的传承.png',
  './古董款Links/19古董款三佛殿雪域三尊版-1.png',
  './古董款Links/19古董款三佛殿雪域三尊版-2.png',
  './古董款Links/19古董款三佛殿雪域三尊版-3.png',
  './古董款详情拆解/19古董款三佛殿雪域三尊版.png',
  './古董款Links/05古董款三佛殿-1.png',
  './古董款Links/05古董款三佛殿-2.png',
  './古董款Links/05古董款三佛殿-3.png',
  './古董款详情拆解/05古董款三佛殿.png',
  './古董款Links/10古董款四臂观音殿珊瑚版-2.png',
  './古董款Links/10古董款四臂观音殿珊瑚版-3.png',
  './古董款Links/10古董款四臂观音殿珊瑚版-1.png',
  './古董款详情拆解/10古董款四臂观音殿珊瑚版.png',
  './当代款Links/11当代款四臂观音殿玲珑款-1.png',
  './当代款Links/11当代款四臂观音殿玲珑款-2.png',
  './当代款Links/11当代款四臂观音殿玲珑款-3.png',
  './当代款详情拆解/11当代款四臂观音殿玲珑款.png',
  './当代款Links/12当代款药师佛殿玲珑款-1.png',
  './当代款Links/12当代款药师佛殿玲珑款-2.png',
  './当代款Links/12当代款药师佛殿玲珑款-3.png',
  './当代款详情拆解/12当代款药师佛殿玲珑款.png',
  './古董款Links/07古董款莲师祖殿-1.png',
  './古董款Links/07古董款莲师祖殿-2.png',
  './古董款Links/07古董款莲师祖殿-3.png',
  './古董款详情拆解/07古董款莲师祖殿.png',
  './古董款Links/20古董款三佛殿阿閦佛版-2.png',
  './古董款Links/20古董款三佛殿阿閦佛版-3.png',
  './古董款Links/20古董款三佛殿阿閦佛版-1.png',
  './古董款详情拆解/20古董款三佛殿阿閦佛版.png',
  './当代款Links/08当代款虚空藏菩萨-1.png',
  './当代款Links/08当代款虚空藏菩萨-2.png',
  './当代款Links/08当代款虚空藏菩萨-3.png',
  './当代款详情拆解/08当代款虚空藏菩萨.png',
  './当代款Links/09当代款阿弥陀佛-1.png',
  './当代款Links/09当代款阿弥陀佛-2.png',
  './当代款Links/09当代款阿弥陀佛-3.png',
  './当代款详情拆解/09当代款阿弥陀佛.png',
  './当代款Links/10当代款金刚萨埵-1.png',
  './当代款Links/10当代款金刚萨埵-2.png',
  './当代款Links/10当代款金刚萨埵-3.png',
  './当代款详情拆解/10当代款金刚萨埵.png',
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap'
];

const shouldTryNetworkFirst = req => {
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return false;
  if (req.mode === 'navigate') return true;
  return /\.(html|js|jsx|json|webmanifest)$/i.test(url.pathname);
};

const putCache = (req, res) => {
  if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(req, clone).catch(()=>{}));
  }
  return res;
};

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // best-effort: don't fail if any item 404s
      Promise.allSettled(CORE.map(u => c.add(u).catch(()=>null)))
    ).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.hostname === 'media.84000.art' || /\.mp4$/i.test(url.pathname)) {
    // Video delivery is owned by the CDN. Never cache it and never substitute
    // an HTML app shell for a failed media request.
    return;
  }

  if (shouldTryNetworkFirst(req)) {
    e.respondWith(
      fetch(new Request(req, { cache: 'reload' }))
        .then(res => putCache(req, res))
        .catch(() => caches.match(req).then(hit => hit || caches.match('./ipad.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => putCache(req, res)).catch(()=>caches.match('./ipad.html'));
    })
  );
});
