const CACHE_NAME="version-1";

this.addEventListener('install',(e)=>{
e.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache)=>{
        console.log("Opened cache");
        cache.addAll([
            "static/js/bundle.js",
            "static/js/0.chunk.js",
            "static/js/0.chunk.js.map",
            "static/js/main.chunk.js",
            "favicon.ico",
            "news1.jpg",
            "index.html",
            "/"
        ]);
    })
)
});

this.addEventListener('fetch',(e)=>{
    if(!navigator.onLine){
        if (e.request.url===`https://react-news-nine.vercel.app/static/js/main.chunk.js`) {
            e.waitUntil(
                this.registration.showNotification("Notify",{
                    body:"You are offline!",
                    icon:"https://www.codester.com/static/uploads/items/000/007/7376/icon.png"
                })
            )
        }
        e.respondWith(
            caches.match(e.request)
            .then((res)=>{
                if(res){
                    return res
                }
                let requestUrl=e.request.clone();
                return fetch(requestUrl)
            })
            )
        }
});