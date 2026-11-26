/* BDA GA4: basic consent. Google is loaded only after an explicit opt-in. */
(function () {
  'use strict';
  if (window.BDAAnalytics || !/^https?:$/.test(location.protocol) || !['barrydataanalytics.de','www.barrydataanalytics.de'].includes(location.hostname)) return;
  const id = 'G-SGJSLM63CB', key = 'bda-analytics-consent-v1';
  // Public, non-tracking preview: exercise the real dialog without resetting a saved choice.
  const preview = new URL(location.href).searchParams.get('cookie-preview') === '1';
  let allowed = false, loaded = false;
  const denied = {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
  function read() {if(preview)return null;try {const x=JSON.parse(localStorage.getItem(key));return x && Date.now()-x.at<15552000000 ? x.choice : null;} catch (_) {return null;}}
  function write(choice) {if(preview)return;try {localStorage.setItem(key,JSON.stringify({choice,at:Date.now()}));}catch (_) {}}
  function command() {window.dataLayer.push(arguments);}
  function start() {
    if(preview)return;
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
    command('config',id,{page_location:page.href,page_referrer:ref,page_title:location.pathname,allow_google_signals:false,allow_ad_personalization_signals:false,send_page_view:true,cookie_expires:15552000});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
  }
  function stop() {
    if(preview)return;
    allowed=false;window['ga-disable-'+id]=true;
    if(loaded)command('consent','update',denied);
    document.cookie.split(';').forEach(part=>{const name=part.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))return;
      ['',location.hostname,'.barrydataanalytics.de'].forEach(domain=>{document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'')+'; SameSite=Lax';});});
  }
  window.BDAAnalytics={event(name,props){if(allowed&&!document.hidden)command('event',name,{...props,send_to:id});},get enabled(){return allowed;}};
  function mount() {
    const box=document.createElement('div');box.id='bda-analytics-choice';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','bda-consent-title');box.setAttribute('aria-describedby','bda-consent-description');
    const title=document.createElement('strong'),description=document.createElement('p'),actions=document.createElement('div');
    const yes=document.createElement('button'),no=document.createElement('button'),settings=document.createElement('button'),privacy=document.createElement('a');
    yes.type=no.type=settings.type='button';privacy.href='/rechtliches.html#datenschutz';privacy.target='_blank';privacy.rel='noopener noreferrer';
    title.id='bda-consent-title';description.id='bda-consent-description';
    const backdrop=document.createElement('div');backdrop.id='bda-consent-backdrop';backdrop.setAttribute('aria-hidden','true');box.hidden=true;backdrop.hidden=true;
    box.append(title,description,actions);actions.append(no,yes,privacy);settings.id='bda-analytics-settings';document.body.append(backdrop,box,settings);
    const style=document.createElement('style');style.textContent="\n#bda-consent-backdrop{position:fixed;inset:0;background:rgba(2,10,18,.62);z-index:2147483645;backdrop-filter:blur(3px)}\n#bda-analytics-choice{box-sizing:border-box;text-align:left;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483646;width:calc(100% - 32px);max-width:560px;margin:0;padding:32px;background:#0b1d2b;color:#f1f8fc;border:1px solid #39727e;border-radius:22px;box-shadow:0 24px 90px #0009;font:16px/1.65 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain;animation:bda-consent-in .22s ease-out}\n#bda-analytics-choice[hidden],#bda-consent-backdrop[hidden],#bda-analytics-settings[hidden]{display:none!important}\n#bda-analytics-choice strong{display:block;font-size:clamp(1.4rem,3vw,1.75rem);line-height:1.3;letter-spacing:-.025em;font-weight:700}\n#bda-analytics-choice strong:before{content:'';display:block;width:38px;height:4px;border-radius:4px;background:#39dfd0;margin-bottom:22px}\n#bda-analytics-choice p{color:#cbdde6;margin:16px 0 24px;white-space:pre-line}\n#bda-analytics-choice div{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n#bda-analytics-choice button,#bda-analytics-settings{font:600 16px/1.4 system-ui;min-height:48px;padding:12px 18px;border:1px solid #67c9ce;border-radius:11px;background:#123341;color:#f4ffff;cursor:pointer}\n#bda-analytics-choice button:hover{background:#194653;border-color:#85ece4}\n#bda-analytics-choice a{grid-column:1/-1;justify-self:center;color:#8bece4;font-size:14px;text-underline-offset:4px;padding:4px;margin-top:2px}\n#bda-analytics-settings{display:block;position:static;margin:18px auto;font-size:14px;padding:8px 12px;width:max-content;background:#0b1d2b}\n#bda-analytics-choice button:focus-visible,#bda-analytics-choice a:focus-visible,#bda-analytics-settings:focus-visible{outline:3px solid #9cf6ed;outline-offset:4px}\n@keyframes bda-consent-in{from{opacity:0;transform:translate(-50%,calc(-50% + 8px))}to{opacity:1;transform:translate(-50%,-50%)}}\n@media(max-width:480px){#bda-analytics-choice{padding:24px;border-radius:18px}#bda-analytics-choice div{gap:10px}#bda-analytics-choice button{padding:12px 8px}}\n@media(max-width:340px){#bda-analytics-choice div{grid-template-columns:1fr}}\n@media(prefers-reduced-motion:reduce){#bda-analytics-choice{animation:none}#bda-consent-backdrop{backdrop-filter:none}}\n";document.head.append(style);
    const copy={"de":["Schön, dass Sie da sind!","Mit Ihrer Zustimmung nutzen wir Google Analytics, um unsere Website zu verbessern.\n\nSie entscheiden freiwillig und können Ihre Wahl jederzeit ändern.","Zustimmen","Ablehnen","Cookie-Einstellungen","Mehr zum Datenschutz"],"en":["Welcome!","With your consent, we use Google Analytics to improve our website.\n\nThe choice is yours, and you can change it at any time.","Accept","Decline","Cookie settings","More about privacy"],"fr":["Bienvenue !","Avec votre accord, nous utilisons Google Analytics pour améliorer notre site.\n\nVous êtes libre de choisir et de modifier votre décision à tout moment.","Accepter","Refuser","Paramètres des cookies","En savoir plus sur la confidentialité"]};
    function render(){const t=copy[(document.documentElement.lang||'de').slice(0,2)]||copy.de;[title,description,yes,no,settings,privacy].forEach((el,i)=>el.textContent=t[i]);}
    render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    let returnFocus=null,scrollBefore='',background=[];
    function showChoice(open){
      const wasOpen=box.hidden===false;box.hidden=!open;backdrop.hidden=!open;settings.hidden=open;
      if(open&&!wasOpen){
        returnFocus=document.activeElement;scrollBefore=document.body.style.overflow;document.body.style.overflow='hidden';
        background=Array.from(document.body.children).filter(el=>el!==box&&el!==backdrop&&el!==settings).map(el=>[el,el.inert]);
        background.forEach(([el])=>{el.inert=true;});no.focus({preventScroll:true});
      }else if(!open&&wasOpen){background.forEach(([el,value])=>{el.inert=value;});background=[];document.body.style.overflow=scrollBefore;}
    }
    box.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();if(read()==='yes'||read()==='no'){showChoice(false);settings.focus({preventScroll:true});}return;}
      if(e.key==='Tab'){if(e.shiftKey&&document.activeElement===no){e.preventDefault();privacy.focus();}else if(!e.shiftKey&&document.activeElement===privacy){e.preventDefault();no.focus();}}
    });
    let autoOpenTimer=null,autoOpenDue=false;
    function cancelAutoOpen(){clearTimeout(autoOpenTimer);autoOpenTimer=null;autoOpenDue=false;}
    function openWhenVisible(){
      if(!autoOpenDue||document.hidden)return;
      autoOpenDue=false;const choice=read();if(choice!=='yes'&&choice!=='no')showChoice(true);
    }
    function scheduleAutoOpen(){
      cancelAutoOpen();autoOpenTimer=setTimeout(()=>{autoOpenTimer=null;autoOpenDue=true;openWhenVisible();},20000);
    }
    document.addEventListener('visibilitychange',openWhenVisible);
    yes.onclick=()=>{cancelAutoOpen();write('yes');start();showChoice(false);(returnFocus&&returnFocus!==document.body?returnFocus:settings).focus({preventScroll:true});};no.onclick=()=>{cancelAutoOpen();write('no');stop();showChoice(false);(returnFocus&&returnFocus!==document.body?returnFocus:settings).focus({preventScroll:true});};settings.onclick=()=>{cancelAutoOpen();showChoice(true);no.focus();};
    const previous=read();showChoice(false);if(previous==='yes')start();else stop();
    if(previous!=='yes'&&previous!=='no')scheduleAutoOpen();
    addEventListener('storage',e=>{if(e.key===key){const choice=read();if(choice==='yes')start();else stop();cancelAutoOpen();showChoice(false);if(choice!=='yes'&&choice!=='no')scheduleAutoOpen();}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
