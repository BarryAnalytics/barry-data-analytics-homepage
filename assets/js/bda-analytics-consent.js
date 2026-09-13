/* BDA GA4: basic consent. Google is loaded only after an explicit opt-in. */
(function () {
  'use strict';
  if (window.BDAAnalytics || !/^https?:$/.test(location.protocol) || !['barrydataanalytics.de','www.barrydataanalytics.de'].includes(location.hostname)) return;
  const id = 'G-SGJSLM63CB', key = 'bda-analytics-consent-v1';
  let allowed = false, loaded = false;
  const denied = {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
  function read() {try {const x=JSON.parse(localStorage.getItem(key));return x && Date.now()-x.at<15552000000 ? x.choice : null;} catch (_) {return null;}}
  function write(choice) {try {localStorage.setItem(key,JSON.stringify({choice,at:Date.now()}));}catch (_) {}}
  function command() {window.dataLayer.push(arguments);}
  function start() {
    allowed=true; window['ga-disable-'+id]=false;
    if (loaded) {command('consent','update',{...denied,analytics_storage:'granted'}); return;}
    loaded=true; window.dataLayer=window.dataLayer||[]; window.gtag=command;
    command('consent','default',denied);
    command('consent','update',{...denied,analytics_storage:'granted'});
    command('js',new Date());
    // Never forward arbitrary URL parameters, fragments, page titles or full referrers.
    const page=new URL(location.origin+location.pathname), input=new URL(location.href);
    ['utm_source','utm_medium','utm_campaign'].forEach(k=>{const v=input.searchParams.get(k);if(v&&/^[a-zA-Z0-9_-]{1,100}$/.test(v))page.searchParams.set(k,v);});
    let ref=''; try {ref=new URL(document.referrer).origin;} catch (_) {}
    command('config',id,{page_location:page.href,page_referrer:ref,page_title:location.pathname,allow_google_signals:false,allow_ad_personalization_signals:false,send_page_view:true});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
  }
  function stop() {
    allowed=false;window['ga-disable-'+id]=true;
    if(loaded)command('consent','update',denied);
    document.cookie.split(';').forEach(part=>{const name=part.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))return;
      ['',location.hostname,'.barrydataanalytics.de'].forEach(domain=>{document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'')+'; SameSite=Lax';});});
  }
  window.BDAAnalytics={event(name,props){if(allowed&&!document.hidden)command('event',name,{...props,send_to:id});},get enabled(){return allowed;}};
  function mount() {
    const box=document.createElement('section');box.id='bda-analytics-choice';box.setAttribute('aria-label','Analytics');
    const title=document.createElement('strong'),description=document.createElement('p'),actions=document.createElement('div');
    const yes=document.createElement('button'),no=document.createElement('button'),settings=document.createElement('button'),privacy=document.createElement('a');
    yes.type=no.type=settings.type='button';privacy.href='/rechtliches.html#datenschutz';privacy.target='_blank';privacy.rel='noopener noreferrer';
    box.append(title,description,actions);actions.append(no,yes,privacy);settings.id='bda-analytics-settings';document.body.append(box,settings);
    const style=document.createElement('style');style.textContent='#bda-analytics-choice{position:fixed;inset:auto 12px 12px;z-index:2147483646;max-width:680px;margin:auto;padding:20px;background:#0b1b26;color:#eef6fa;border:1px solid #47818e;border-radius:14px;box-shadow:0 8px 32px #0008;font:16px/1.5 system-ui;max-height:80vh;overflow:auto}#bda-analytics-choice[hidden]{display:none}#bda-analytics-choice p{color:#d2dfe5;margin:10px 0}#bda-analytics-choice div{display:flex;gap:10px;flex-wrap:wrap;align-items:center}#bda-analytics-choice button,#bda-analytics-settings{font:14px system-ui;padding:10px 14px;border:1px solid #73ccd5;border-radius:8px;background:#102c38;color:#fff;cursor:pointer}#bda-analytics-choice a{color:#75e5ed}#bda-analytics-settings{position:fixed;bottom:6px;left:50%;transform:translateX(-50%);z-index:2147483645;font-size:12px;padding:5px 9px}#bda-analytics-choice button:focus-visible,#bda-analytics-settings:focus-visible{outline:3px solid #fff;outline-offset:2px}';document.head.append(style);
    const copy={de:['Besuchsstatistik','Mit Ihrer Zustimmung verwenden wir Google Analytics, um Besuche und Klicks auf dieser Website auszuwerten. Dabei werden Nutzungs- und Geräteinformationen an Google übermittelt und Analyse-Cookies gespeichert. Ihre Wahl ist freiwillig und kann über „Statistik-Einstellungen“ jederzeit geändert werden.','Zustimmen','Ablehnen','Statistik-Einstellungen','Datenschutzerklärung'],en:['Visitor statistics','With your consent, we use Google Analytics to measure visits and clicks on this website. Usage and device information is sent to Google and analytics cookies are stored. Your choice is optional and can be changed at any time through “Analytics settings”.','Accept','Decline','Analytics settings','Privacy policy'],fr:['Statistiques de fréquentation','Avec votre accord, nous utilisons Google Analytics pour mesurer les visites et les clics sur ce site. Des données d’utilisation et d’appareil sont transmises à Google et des cookies de mesure sont enregistrés. Ce choix est facultatif et peut être modifié à tout moment dans « Réglages des statistiques ».','Accepter','Refuser','Réglages des statistiques','Confidentialité']};
    function render(){const t=copy[(document.documentElement.lang||'de').slice(0,2)]||copy.de;[title,description,yes,no,settings,privacy].forEach((el,i)=>el.textContent=t[i]);}
    render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    yes.onclick=()=>{write('yes');start();box.hidden=true;settings.focus();};no.onclick=()=>{write('no');stop();box.hidden=true;settings.focus();};settings.onclick=()=>{box.hidden=false;no.focus();};
    const previous=read();box.hidden=previous==='yes'||previous==='no';if(previous==='yes')start();else stop();
    addEventListener('storage',e=>{if(e.key===key){if(read()==='yes')start();else stop();}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
