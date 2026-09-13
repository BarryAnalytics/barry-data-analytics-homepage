/* Public event helper. Requires bda-analytics-consent.js; sends only after consent.
   No automatic interactions, customer names, email addresses or URL queries are sent. */
(function(){
 'use strict';if(window.__bdaInterestV2)return;window.__bdaInterestV2=true;
 if(!/^https?:$/.test(location.protocol)||!['barrydataanalytics.de','www.barrydataanalytics.de'].includes(location.hostname))return;
 function send(name,props){if(document.hidden||!window.BDAAnalytics)return;try{window.BDAAnalytics.event(name.toLowerCase().replace(/ /g,'_'),props||{})}catch(e){}}
 const demo=/\/(demo|power-bi-sales-operations|sales-growth-command-center|excel-executive-management|connected_data_management|business-prozess-demo|vier-saeulen-loesungsdemo|crm-cockpit-demo|projekt-dashboard-demo|projekt-demo-live|projekt_conationdemos)(\/|$)/i;
 document.addEventListener('click',function(e){if(!e.isTrusted)return;const target=e.target.closest&&e.target.closest('a,button');if(!target)return;
  if(target.tagName==='A'){let u;try{u=new URL(target.getAttribute('href'),location.href)}catch(e){return}
   if(u.protocol==='mailto:'){send('Email Click');return}if(u.protocol==='tel:'){send('Phone Click');return}
   if(['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(u.hostname)){send('WhatsApp Click');return}
   if(/(^|\.)linkedin\.com$/.test(u.hostname)){send('LinkedIn Out');return}
   if(u.origin===location.origin){if(demo.test(u.pathname))send('Demo Open',{page:u.pathname});if(/\/projektanalyse(\/|$)/i.test(u.pathname))send('Project Analysis Click');if(u.hash==='#contact')send('Contact Section Click')}
  }else if(demo.test(location.pathname)){if(target.hasAttribute('data-source'))send('Demo Source Select',{source:String(target.getAttribute('data-source')).slice(0,2)});if(target.hasAttribute('data-region'))send('Demo Region Select');if(target.id==='pause')send('Demo Playback Control')}
 },true);
 document.addEventListener('change',e=>{if(e.isTrusted&&demo.test(location.pathname)&&e.target.id==='filter')send('Demo Region Select')},true);
 // Native play events also fire for autoplay; require a recent trusted media interaction.
 let mediaIntent=0;document.addEventListener('pointerdown',e=>{if(e.isTrusted&&e.target.tagName==='VIDEO')mediaIntent=Date.now()},true);
 document.addEventListener('keydown',e=>{if(e.isTrusted&&e.target.tagName==='VIDEO')mediaIntent=Date.now()},true);
 document.addEventListener('play',e=>{if(e.target.tagName==='VIDEO'&&Date.now()-mediaIntent<2500)send('Video Play')},true);
 // Automatic scroll animations are excluded unless the visitor recently scrolled manually.
 let intent=0,pending=false;const seen=new Set();['wheel','touchmove','keydown'].forEach(type=>addEventListener(type,e=>{if(e.isTrusted&&(type!=='keydown'||['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key)))intent=Date.now()},{passive:true}));
 addEventListener('scroll',()=>{if(pending||Date.now()-intent>1800)return;pending=true;requestAnimationFrame(()=>{pending=false;const max=document.documentElement.scrollHeight-innerHeight;if(max<100)return;const pct=Math.min(100,Math.floor(scrollY/max*100));[50,75,90].forEach(n=>{if(pct>=n&&!seen.has(n)){seen.add(n);send('Scroll Depth '+n)}})})},{passive:true});
})();
