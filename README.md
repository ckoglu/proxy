# 🌐 CORS Proxy Hizmeti

Farklı kaynaklardan (cross-origin) gelen web isteklerinde tarayıcıların uyguladığı CORS (Cross-Origin Resource Sharing) güvenlik politikasını aşmak için geliştirilmiş basit ve ücretsiz bir proxy arayüzü.

## 🤔 CORS Nedir?

CORS (Cross-Origin Resource Sharing), web tarayıcıları tarafından uygulanan bir güvenlik protokolüdür. Bir web sayfasının, kendisinden farklı bir **kaynakta** (farklı alan adı, protokol veya port) bulunan API'lere veya kaynaklara doğrudan HTTP istekleri göndermesini kısıtlar. Bu, kötü niyetli sitelerin sizin adınıza başka sitelere istek yapmasını engellemek için tasarlanmıştır.

## ⚙️ Nasıl Çalışır?

Bu proxy, tarayıcınız ile ulaşmak istediğiniz hedef API arasında bir aracı görevi görür. Akış şu şekildedir:

```
Sizin Tarayıcınız  ──>  Proxy Sunucusu  ──>  Hedef API
```

Tarayıcıların CORS kısıtlamaları sadece web sayfalarından yapılan istekler için geçerlidir. Proxy bir sunucu tarafı uygulama olduğu için bu kısıtlamalara tabi değildir. Böylece, tarayıcınız proxy'e istek yapar, proxy de hedef API'ye giderek veriyi alır ve size geri döndürür.

## 🚀 Hızlı Başlangıç

Proxy'yi kullanmak için hedef URL'yi `?url=` parametresiyle proxy adresine eklemeniz yeterlidir.

### Temel Yapı
```
https://proxy.ckoglu.workers.dev/?url=<HEDEF_URL>
```

### Kaynak Kodu Görüntüleme
Bir sayfanın kaynak kodunu CORS engeli olmadan görmek için:
```
https://ckoglu.github.io/proxy/?url=<HEDEF_URL>
```

## 🛠️ Örnek API Entegrasyonu

Aşağıda, `jsonplaceholder` adlı herkese açık bir test API'sinden veri çekmek için proxy'nin nasıl kullanılacağını gösteren bir örnek bulunmaktadır.

### JavaScript Fetch Örneği

```javascript
// Ulaşmak istediğimiz asıl API adresi
const targetUrl = 'https://jsonplaceholder.typicode.com/posts/1';

// Proxy üzerinden oluşturulan yeni URL
const proxyUrl = `https://proxy.ckoglu.workers.dev/?url=${targetUrl}`;

fetch(proxyUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // veya .text()
  })
  .then(data => {
    console.log(data);
    // Gelen veriyi burada işleyebilirsiniz.
    // document.body.textContent = JSON.stringify(data, null, 2);
  })
  .catch(err => console.error("Proxy Hatası:", err));
```

## 📌 Önemli Notlar

- Bu proxy, geliştirme, test veya küçük ölçekli projeler için idealdir. Yüksek trafikli veya production uygulamaları için kendi proxy sunucunuzu kurmanız önerilir.
- **Hassas veriler göndermeyin!** API anahtarları, kullanıcı bilgileri veya diğer gizli verileri bu tür halka açık proxy'ler üzerinden iletmekten kaçının.
- Proxy, temel olarak `GET` istekleri için tasarlanmıştır. Diğer HTTP metodları (POST, PUT, DELETE vb.) için beklendiği gibi çalışmayabilir.

## 🤝 Katkıda Bulunma

Katkılarınız için GitHub Repo sayfasını ziyaret edebilirsiniz.

## 🔗 Sayfayı Gör

[CORS Proxy API](https://ckoglu.github.io/proxy/)

## 📄 Lisans

[MIT License](https://opensource.org/licenses/MIT)
