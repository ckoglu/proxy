const scriptKey = "AKfycbw_MYcInMCCYiQZNzeaZAp7Upl_UwNZS2O1rlx1bDBwBT7UFJJPEpvNSSmbkCgWXATk";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(() => {
    console.log("Service Worker kayıt edildi");
  }).catch(err => {
    console.error("Service Worker kayıt hatası:", err);
  });
}

async function fetchWithRetry(url, retries = 1) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (text.trim().startsWith('<')) {
      location.reload();
      return;
    }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    if (retries > 0) {
      console.warn("Retrying fetch due to error:", error.message);
      return fetchWithRetry(url, retries - 1);
    } else {
      throw error;
    }
  }
}

function updateSourceLink(val) {
  const sourceLink = document.getElementById("source-link");
  if (val) {
    sourceLink.textContent = `${location.origin}${location.pathname}?site=${encodeURIComponent(val)}`;
    sourceLink.href = sourceLink.textContent;
  } else {
    sourceLink.textContent = `${location.origin}${location.pathname}?site=<url_to_http_resource>`;
    sourceLink.href = "#";
  }
}

function beforeClick() {
  document.getElementById("source-script").innerHTML =
`<span class="keyword">(async</span> () =&gt; {
  <span class="keyword">const</span> site = <span class="keyword">new</span> <span class="function">URLSearchParams</span>(location.search).<span class="function">get</span>(<span class="string">"site"</span>);
  <span class="keyword">if</span> (!site) <span class="keyword">return</span>;
  <span class="keyword">try</span> {
    <span class="keyword">const</span> res = <span class="keyword">await</span> <span class="function">fetch</span>(<span class="string">'https://script.google.com/macros/s/${scriptKey}/exec?site='</span> + <span class="function">encodeURIComponent</span>(site));
    document.body.textContent = <span class="keyword">await</span> res.<span class="function">text</span>();
  } <span class="keyword">catch</span> (e) {
    document.body.textContent = <span class="string">"Hata: "</span> + e.message;
  }
})();`;
}

function afterClick() {
  const input = document.getElementById("siteUrl");
  const siteValue = input && input.value.trim() ? input.value.trim() : "https://www.site.com";

  document.getElementById("source-script").innerHTML =
`<span class="keyword">(async</span> () =&gt; {
  <span class="keyword">const</span> site = <span class="string">'${siteValue}'</span>;
  <span class="keyword">try</span> {
    <span class="keyword">const</span> res = <span class="keyword">await</span> <span class="function">fetch</span>(<span class="string">'https://script.google.com/macros/s/${scriptKey}/exec?site='</span> + <span class="function">encodeURIComponent</span>(site));
    document.body.textContent = <span class="keyword">await</span> res.<span class="function">text</span>();
  } <span class="keyword">catch</span> (e) {
    document.body.textContent = <span class="string">"Hata: "</span> + e.message;
  }
})();`;
}

document.getElementById('proxyForm').addEventListener('submit', e => {
  e.preventDefault();
  const siteUrl = document.getElementById('siteUrl').value.trim();
  if (!siteUrl) return alert('Lütfen geçerli bir URL girin');
  const proxyUrl = window.location.pathname + '?site=' + encodeURIComponent(siteUrl);
  window.open(proxyUrl, '_blank');
});

const el = document.querySelector('.source-script');
el.addEventListener('click', e => {
  const rect = el.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const beforeRightEdge = rect.width - 75;
  const beforeLeftEdge = beforeRightEdge - 70;
  const topEdge = 0;
  const bottomEdge = 30;

  const afterRightEdge = rect.width - 8;
  const afterLeftEdge = afterRightEdge - 60;

  if (clickY >= topEdge && clickY <= bottomEdge) {
    if (clickX >= beforeLeftEdge && clickX <= beforeRightEdge) {
      beforeClick();
      return;
    }
    if (clickX >= afterLeftEdge && clickX <= afterRightEdge) {
      afterClick();
      return;
    }
  }
});

const siteInput = document.getElementById("siteUrl");
siteInput.addEventListener("input", () => {
  updateSourceLink(siteInput.value.trim());
  const sourceScriptContent = document.getElementById('source-script').textContent;
  if (!sourceScriptContent.includes("URLSearchParams")) {
    document.querySelector('#source-script .string').textContent = siteInput.value.trim();
  }
});

window.addEventListener("load", async () => {
  let newUrl;
  if (location.pathname.endsWith("index.html")) {
    newUrl = `${location.origin}${location.pathname.replace(/index\.html$/, '')}`;
  } else if (location.pathname.endsWith('/')) {
    newUrl = `${location.origin}${location.pathname}`;
  } else {
    newUrl = `${location.origin}${location.pathname}/`;
  }
  history.replaceState({}, "", newUrl);

  document.getElementById('prefix').textContent = `${location.origin}${location.pathname}?site=`;
  updateSourceLink('');

  const params = new URLSearchParams(location.search);
  const site = params.get("site");
  beforeClick();

  if (site) {
    try {
      const url = `${location.origin}${location.pathname}?site=${encodeURIComponent(site)}`;
      const json = await fetchWithRetry(url, 1);
      document.body.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      document.body.textContent = "Hata: " + e.message;
      console.error("Fetch hatası:", e);
    }
  }
});
