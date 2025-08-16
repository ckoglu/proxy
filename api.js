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
    sourceLink.textContent = `${location.origin}${location.pathname}?url=${encodeURIComponent(val)}`;
    sourceLink.href = sourceLink.textContent;
  } else {
    sourceLink.textContent = `${location.origin}${location.pathname}?url=<url_to_http_resource>`;
    sourceLink.href = "#";
  }
}

function fetchClick() {
  const input = document.getElementById("siteUrl");
  const siteValue = input && input.value.trim() ? input.value.trim() : "https://www.site.com";
  document.getElementById("source-script").innerHTML =
`<span class="function">fetch</span>(<span class="string">"https://proxy.ckoglu.workers.dev/?url=${siteValue}"</span>)
.then(<span class="variable">res</span> =&gt; <span class="variable">res</span>.<span class="function">text</span>())
.then(<span class="variable">data</span> =&gt; {<span class="variable">document</span>.<span class="variable">body</span>.<span class="variable">textContent</span> = <span class="variable">data</span>;})
.catch(<span class="variable">err</span> =&gt; <span class="variable">console</span>.<span class="function">error</span>(<span class="string">"hata:"</span>, <span class="variable">err</span>));`;
}

document.getElementById('proxyForm').addEventListener('submit', e => {
  e.preventDefault();
  const siteUrl = document.getElementById('siteUrl').value.trim();
  if (!siteUrl) return alert('Lütfen geçerli bir URL girin');
  const proxyUrl = window.location.pathname + '?url=' + encodeURIComponent(siteUrl);
  window.open(proxyUrl, '_blank');
});

const siteInput = document.getElementById("siteUrl");
siteInput.addEventListener("input", () => {
  updateSourceLink(siteInput.value.trim());
  const sourceScript = document.getElementById('source-script');
  const stringEl = sourceScript.querySelector('.string');
  let currentUrl = stringEl.textContent;
  if (currentUrl.includes("?url=")) {
    const beforePart = currentUrl.split("?url=")[0]; // ?url= öncesi
    stringEl.textContent = beforePart + "?url=" + siteInput.value.trim() + '"';
    if (siteInput.value.trim() === "") {stringEl.textContent = beforePart + '?url=https://www.site.com"';}
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

  document.getElementById('prefix').textContent = `${location.origin}${location.pathname}?url=`;
  updateSourceLink('');

  const params = new URLSearchParams(location.search);
  const site = params.get("site");
  fetchClick();

  if (site) {
    try {
      const url = `${location.origin}${location.pathname}?url=${encodeURIComponent(site)}`;
      const json = await fetchWithRetry(url, 1);
      document.body.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      document.body.textContent = "Hata: " + e.message;
      console.error("Fetch hatası:", e);
    }
  }
});
