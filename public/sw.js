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