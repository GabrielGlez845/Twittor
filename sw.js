//impoerts
importScripts('js/sw-utils.js')

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CAHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmuatble-v1';

const APP_SHELL = [
  //  '/',
    'index.html',
    'css/style.css',
    'css/animate.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e=>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>{
        cache.addAll(APP_SHELL)
    })

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>{
        cache.addAll(APP_SHELL_INMUTABLE)
    })

    e.waitUntil(Promise.all[cacheStatic,cacheInmutable]);
})

//
self.addEventListener('activate', e =>{
    const respuesta = caches.keys().then( keys=>{
        keys.forEach(key=>{
            //static-v4
            if (key !== STATIC_CACHE && key.includes('static') ){
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CAHE && key.includes('dynamic') ){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(respuesta);
})

self.addEventListener('fetch', e=>{

    const respuesta = caches.match(e.request).then(res =>{
        if(res){
            return res
        }else{
            return fetch(e.request).then(newRes=>{
                    return actualizaCacheDinamico(DYNAMIC_CAHE,e.request, newRes);
            })
            console.log(e.request.url)
        }
       
    })

    e.respondWith(respuesta)
})