// const webpush = require('web-push');
export default function swDev(){
 
// function urlBase64ToUint8Array(base64String) {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//       .replace(/-/g, '+')
//       .replace(/_/g, '/');
   
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
   
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   }
   
//   const vapidPublicKey =webpush.generateVAPIDKeys();
//   const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey.publicKey);
    let swUrl=`https://react-news-nine.vercel.app/sw.js`
    navigator.serviceWorker.register(swUrl)
        .then(res=>{
            console.log("running",res.scope)
            // return res.pushManager.getSubscription()
            //     .then((subscribtion)=>{
            //         return res.pushManager.subscribe({
            //             userVisibleOnly: true,
            //             applicationServerKey: convertedVapidKey
            //           });
            //     })
        })
}