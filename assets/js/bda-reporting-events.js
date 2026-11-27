/* Counts completed self-checks and outgoing intent; never submitted enquiries or bookings. */
(()=>{'use strict';
 const form=document.getElementById('reporting-check'),result=document.getElementById('result');
 if(!form||!result)return;
 let counted=false;
 document.addEventListener('submit',e=>{
  if(e.target!==form||!e.isTrusted||result.hidden||counted)return;
  if(!window.BDAAnalytics?.enabled)return;
  counted=true;window.BDAAnalytics.event('reporting_check_complete',{app_area:'reporting_check'});
 });
 form.addEventListener('reset',()=>{counted=false;});
 document.addEventListener('click',e=>{
  if(!e.isTrusted)return;
  if(e.target.closest?.('#open-enquiry,#include-summary')){
   window.BDAAnalytics?.event('enquiry_form_open',{app_area:'reporting_check'});return;
  }
  const a=e.target.closest?.('a[href]');if(!a)return;
  let u;try{u=new URL(a.href,location.href)}catch(_){return;}
  if(u.hostname==='bookings.cloud.microsoft')window.BDAAnalytics?.event('booking_open',{app_area:'reporting_check'});
 });
})();
