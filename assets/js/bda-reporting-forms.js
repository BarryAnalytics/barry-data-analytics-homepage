/* BDA Reporting Check -> Microsoft Forms. No credentials or personal data on this page. */
(() => {
  'use strict';
  const config = bdaEnquiryConfig;
  const supported = {de: '/reporting-automatisieren/', en: '/reporting-automatisieren/en/', fr: '/reporting-automatisieren/fr/', ar: '/reporting-automatisieren/ar/'};
  const source = new URLSearchParams(location.search);
  const attribution = ['utm_source', 'utm_medium', 'utm_campaign']
    .filter(key => /^[a-z0-9_-]{1,64}$/i.test(source.get(key) || ''))
    .map(key => key + '=' + source.get(key)).join(' | ');
  function enquiryUrl(includeSummary) {
    const url = new URL(config.formUrl);
    url.searchParams.set('lang', config.locale);
    url.searchParams.set('re06e076ff0a646fc94d200169df6086e', JSON.stringify(config.answerLanguage));
    const text = includeSummary && summary ? summary : config.prefill;
    url.searchParams.set('r2b4363cd039845c5af4c365a84813b36', text + '\n\n[Reporting-Check | ' + config.lang + (attribution ? ' | ' + attribution : '') + ']');
    // Name, email and contact permission are deliberately never prefilled.
    // Forms' prefill decoder expects percent-encoded spaces, not form-style '+'.
    return url.href.replace(/\+/g, '%20');
  }
  const link = document.getElementById('open-enquiry');
  if (link) link.href = enquiryUrl(false);
  const include = document.getElementById('include-summary');
  if (include) include.addEventListener('click', () => {
    if (!summary) return;
    include.href = enquiryUrl(true);
  });
  const picker = document.getElementById('language-select');
  if (picker) picker.addEventListener('change', () => {
    const chosen = picker.value;
    if (!supported[chosen] || chosen === config.lang) return;
    try { sessionStorage.setItem('bdaReportingLanguage', chosen); } catch {}
    const url = new URL(supported[chosen], location.href);
    url.search = location.search;
    url.searchParams.set('lang', chosen);
    url.hash = location.hash;
    location.assign(url.href);
  });
})();
