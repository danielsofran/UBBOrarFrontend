if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let t={};const u=s=>i(s,r),a={module:{uri:r},exports:t,require:u};e[r]=Promise.all(l.map((s=>a[s]||u(s)))).then((s=>(n(...s),t)))}}define(["./workbox-4c590284"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/focus-visible-legacy-CdO5cX4I.js",revision:null},{url:"assets/focus-visible-supuXXMI.js",revision:null},{url:"assets/index-BDNIZA_f.css",revision:null},{url:"assets/index-Dl1W2x0y.js",revision:null},{url:"assets/index-legacy-CGysiT6h.js",revision:null},{url:"assets/index9-BW_87zll.js",revision:null},{url:"assets/index9-legacy-CcJeKez8.js",revision:null},{url:"assets/input-shims-BSp3U3ZM.js",revision:null},{url:"assets/input-shims-legacy-BYmkwwdt.js",revision:null},{url:"assets/ios.transition-legacy-CDqs52C2.js",revision:null},{url:"assets/ios.transition-vfANAf6n.js",revision:null},{url:"assets/md.transition-DA7E44fr.js",revision:null},{url:"assets/md.transition-legacy-Bk1cLHNE.js",revision:null},{url:"assets/polyfills-legacy-DFKJrdlQ.js",revision:null},{url:"assets/status-tap-BSkg2vBF.js",revision:null},{url:"assets/status-tap-legacy-CegOeqit.js",revision:null},{url:"assets/swipe-back-Bse4Y57i.js",revision:null},{url:"assets/swipe-back-legacy-DPNw1fL_.js",revision:null},{url:"assets/web-B4Dg1DY6.js",revision:null},{url:"assets/web-legacy-C4ygK2QN.js",revision:null},{url:"index.html",revision:"868a56235f180632ffdbbed4e127a119"},{url:"registerSW.js",revision:"bf7a8754e7a5fdb13f8be37793c6fd1f"},{url:"manifest.webmanifest",revision:"57cde17488c55113e7163562e0ad47bb"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/^https:\/\/horatiu-udrea.github.io\/cs-ubb-timetable-parser\/.*/,new s.NetworkFirst({cacheName:"api-cache",plugins:[new s.ExpirationPlugin({maxEntries:25,maxAgeSeconds:2419200})]}),"GET"),s.registerRoute(/^https:\/\/danielsofran.github.io\/UBBOrarFrontend\/.*/,new s.StaleWhileRevalidate({cacheName:"static-web-app-cache",plugins:[new s.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2419200})]}),"GET")}));
