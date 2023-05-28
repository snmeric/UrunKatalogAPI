
# Ürün Katalog Projesi

Selçuk Üniversitesi Bilgisayar Mühendisliği 4.Sınıf öğrencisi olarak İş Yeri Eğitimim için Primefor Şirketine yaptığım Ürün Katalog Projesi için yaptığım proje.



#### Üye Ol Detayları
• Kullanıcılar sisteme uye olabilmeli. Kayit isleminde alinan bilgiler eksiksiz olmali ve validate 
edilmeli. Email bilgisi gecerli olmali.
• Kayit sirasinda kullanici sifresi sifrelenmis sekilde databasede saklanmali. 
• Ayni sifreye sahip kullanicilarin hashelenmis sifreleri mutlaka farkli olmali. (Tuzlama)
• Sifreler geri cozulemeyecek sekilde sifrelenip saklanmali.
• Email valid olmalı
• En az 8 ve en fazla 20 karakter uzunluğunda bir password girilmeli
• İşlem başarısız ise kullanıcıya tasarıma göre hata mesajı gösterilmeli
• İşlem başarılı ise API'den basarili mesaji gonderilmeli ve Hosgeldiniz Email i gonderilmeli.
#### Üye Girişi Detayları
• Kullanıcılar burden üye girişi yapabilmeli
• Email ve Password alanları zorunlu alanlar olmali. Bos yada gecersiz gonderilirse uyari 
verilmeli.
• Email ve Password alanlarının validasyonu yapılmalı
• Email valid olmalı ve en az 8 ve en fazla 20 karakter uzunluğunda bir password girilmeli
• İşlem başarısız ise kullanıcıya hata mesajı gösterilmeli
• İşlem başarılı ise API'de JWT token uretilmeli ve tüm authantication gerektiren requestlerde 
header'a Bearer token olarak eklenmeli.
• 3 kez parolanin yanlis girilmesi durumunda hesabi bloke ediniz ve kullaniciya bilgilendirme 
maili gonderiniz. 
#### Email Servisi
• Email gonderme islemlerini Sync olarak gonderecek bir tasarim yapmayiniz. 
• Email ler bir kuyruk tablosunda toplanmali ve bir process ordan email gonderimi yapmali. 
• Database,kafka, rabbitmq vs uzerinde kuyruklama islemi yapabilirsiniz. 
• Hangfire gibi servisler kullanarak da yapabilirsiniz.
• Kuyruga gelen her email in en gec 2sn icerisinde process edilmeli. 
• Gonderilen email ler in status durumunu guncelleyiniz. 
• Try count ile basarisiz olmasi durumunda terkar gondermesini saglayiniz. 
• 5 kez deneyip basarisiz olan kayitlari Farkli bir statuye cekerek guncelleyiniz
• Smtp entegrasyonu yaparak mail gonderimini saglayiniz. 
• Smtp hizmetinin calisir sekilde oldugundan emin olunuz. 
#### Kategori Detayları
• Tüm kategoriler listelenmeli
• Kullanıcı kategori id ile api call yaptiginda kategori altindaki ürünler kategoriye göre 
filtrelenmeli, default olarak tüm ürünler çekilmeli.
• Yeni kategori eklenebilmeli veya mevcut olan guncellenebilmeli. 
#### Ürün Detayları
• Teklif Ver apisi üründen gelen data içerisindeki isOfferable alanına gore control edilmeli.
• isOfferable durumunun saglanmadigi takdirde teklif verilememeli. 
• Teklif Ver apisi ile kullanıcı kendisi teklif girebilmeli. Teklif girme alanı number olmalı ve 
buraya validasyon eklenmeli
• ayrica Teklif degeri yuzdelik olarak api tarafına yollanabilmeli (offeredPrice), mesela, 100₺
olan ürün için %40 değeri seçilirse, 40₺ teklif yapılabilmeli
• Eğer bir kullanıcı bir ürüne teklif verdiyse, o ürünün icin teklifini geri cekebilmeli. Verdigi teklif 
yoksa kullanicilar bilgilendirilmeli. 
• Kullanıcı teklif yapmadan bir ürünü direk satın alabilir. Kullanıcı ürünü satın alınca, ilgili ürün 
datası içerisindeki isSold alanının değeri guncellenmeli. 
#### Hesabım Detayları
• Kullanicinin yaptigi offer lar listelenmeli. 
• Kullanicinin urunleri icin aldigi offer lar listelenmeli. 
• Alınan tekliflere Onayla ve Reddet ile cevap verilebilmeli
• Verilen teklif onaylandığında satin alma icin uygun duruma getirilmeli. 
• Ürün detay daki gibi Satın Al tetiklenince statu guncellenmeli. Satın Al'a tetiklenince Teklif 
Verdiklerim listesindeki ürünün durumu güncellenmeli
#### Ürün Ekleme Detayları
• İlgili validasyonlar eklenmeli:
• Ürün Adı alanı maksimum 100 karakter uzunluğunda olmalı ve zorunlu bir alan olmalı
• Açıklama alanı maksimum 500 karakter uzunluğunda olmalı ve zorunlu bir alan olmalı
• Kategori alanı ilgili endpointten çekilen kategorileri listelemeli ve en fazla bir kategori 
seçilebilmeli. Bu alan zorunlu bir alan olmalı
• Renk alanı ilgili endpointten çekilen renkleri listelemeli ve en fazla bir renk seçilebilmeli. Bu 
alan zorunlu bir alan olmamalı
• Marka alanı ilgili endpointten çekilen markaları listelemeli ve en fazla bir marka seçilebilmeli. 
Bu alan zorunlu bir alan olmamalı
• Kullanım Durumu alanı ilgili endpointten çekilen kullanım durumlarını listelemeli ve en fazla 
bir kullanım durumu seçilebilmeli. Bu alan zorunlu bir alan olmalı
• Ürün Görseli alanından en fazla bir ürün görseli eklenmeli. Eklenen ürün görseli istenildiği 
zaman silinebilmeli. Bu alan zorunlu bir alan olmalı. Sadece png/jpg/jpeg formatında 
görseller eklenmeli. Maksimum 400kb değerinde görseller eklenilebilmeli
• Fiyat alanı number olmalı ve zorunlu bir alan olmalı
• Teklif Opsiyonu alanı boolean bir değer olmalı ve default olarak false olmalı




## Kullanılanlar

- .NET 6 Web API
- React
- Microsoft SQL 
- Automapper
- Generic Repository Pattern & Unit of Work
- JWT Token
- Hangfire
- SMTP
- Identity 
- Clean Architecture
## Projeyi Bilgisayarınızda Çalıştırın

### Gerekenler
- Visual Studio 2022
- .Net 6 için gerekli kurulumlar
- Microsoft SQL Server 2019
- React.js için gerekli kurulumlar


#### İlk olarak aşağıdaki komutu kopyalanız. Ardından terminal ekranını açarak, projenin kurulmasını istediğiniz bir alana gelerek yapıştırıp çalıştırınız.

```bash
  git clone https://github.com/snmeric/UrunKatalogAPI.git
```

#### Projeyi build edip gerekli veritabanı işlemlerini yapın.

```bash
  update-database
```

#### Swagger sayfasına ulaşmak için:

```bash
  https://localhost:7104/swagger
```
#### Hangfire sayfasına ulaşmak için:

```bash
  https://localhost:7104/hangfire
```

# React.js
Bu projenin UI tarafında Create React App ve Tailwind CSS ile bazı paketleri kullandım.

## Kullanılan paketler
- @headlessui/react
- @heroicons/react
- @material-tailwind/react
- @nextui-org/react
- formik
- moment
- react-auth-kit
- react-axios
- react-hot-toast
- react-icons
- react-intl-currency-input
- react-select
- yup


#### Projenin dizinine gidin

```bash
  cd urunkatalog_client
```

#### Gerekli paketleri yükleyin

```bash
  npm install
```

#### Sunucuyu çalıştırın

```bash
  npm run start
```
####  Proje tarayıcıda görüntülemek için aşağıdaki adresi açar

  ```bash
  http://localhost:3000
```
## API Kullanımı


#### Kayıt olma

```http
  POST /Authenticate/register
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | 6 karakterden fazla karakter kullanılması gerekir |
| `email` | `string` | Email |
| `password` | `string` | En az 8, en fazla 20 karakter uzunluğunda şifre |

#### Giriş yapma
```http
  POST /Authenticate/login
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | Email |
| `password` | `string` | En az 8, en fazla 20 karakter uzunluğunda şifre |

#### Brand (Marka)
Tüm markları getirir.
```http
  GET /api/Brand
```
#### Id'ye göre Brand (Marka) getirme
```http
  GET /api/Brand/{id}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Markanın Id'si gerekir. |


#### Brand (Marka) Oluşturma
```http
  POST /Authenticate/login
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Oluşturmak istediğiniz markanın adı. |


#### Kullanıcıya ait teklifleri getirir.

```http
  GET /api/Account/{Username}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | Giriş yapan kullanıcı yaptığı teklifleri çeker. |

#### Kullanıcının aldığı teklifleri getirir.

```http
  GET /api/Account
```


#### Gelen Teklifleri kabul etme.

```http
  GET /api/Account/OfferAccept/{id}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Teklifin Id'si gerekir. |
  
#### Gelen Teklifleri reddetme.

```http
  GET /api/Account/OfferReject/{id}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Teklifin Id'si gerekir. |

#### Ürünleri kategorisine göre çağırma

```http
  GET /api/Product/category/{categoryId}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `categoryId` | `int` | Kategori Id ile o kategoride olan ürünler gelir. |

#### Ürünleri direk satın alma

```http
  GET /api/Product/purchase/{id}
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Ürünün id'si ile direk satın alınabilir. |

## Ekran Görüntüleri

#### Swagger
![Screenshot_1](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/756a6df7-f5fa-40c7-9b6d-98f8cb22557e)
![Screenshot_2](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/652602e6-9869-4181-b6e7-f340230ec307)
![Screenshot_8](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/b1bbaf87-0b15-4691-956e-f9002db93169)

#### Giriş ve Kayıt Ol (Kayıt olduktan sonra hangfire ile eposta atılır. 3'den fazla hata yapması durumunda hesabınız bloke oldu mesajı atılır)
![Screenshot_3](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/ad65e1ec-8d60-4e98-9dd4-7cfcdb274c8f)
![Screenshot_4](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/20eeebe4-1045-410c-8e3c-30e070dfe2fa)
![Screenshot_16](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/204bb24e-21df-47ac-bf38-c64f5b193d69)
![Screenshot_17](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/8da0b78a-479b-47c3-b063-33df5768dda1)

#### Anasayfa (Default olarak hepsini getirir. Seçilen kategoriye göre ise o kategoriye ait ürünler getirilir)
![Screenshot_5](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/fb594d86-daf5-4113-a959-94b133959fd7)
![Screenshot_6](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/91855073-6b3b-4d65-bf4f-9c2edac69b28)
![Screenshot_7](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/5e8ab75b-6749-4242-adf4-27d81dbd21fd)

#### Ürün Detay Sayfası (Satın Alma ve Teklif Verme olarak iki yöntem vardır teklif vermede yüzde olarak değer vererek girebilirsiniz. Örneğin 100TL lik ürüne verilen yüzde 40 değeri 40 TL olarak yansır ayrıca direk fiyat teklifi de verebilirsiniz. Satın Al butonu ürünü direk satın almaya yarar.)
![Screenshot_18](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/4e10d9f9-29fd-4eb5-9565-bd69a2417549)
![Screenshot_19](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/7df8887d-b4c8-48cc-847e-9523ab1f745c)

#### Teklif Ettiklerim ve Gelen Teklifler (Teklif edilen teklifler geri çekilebilir ayrıca gelen teklifler de silinip onaylananabilir. Ürüne gelen teklif onaylandıktan sonra o ürüne gelen diğer teklifler silinir ve satıldı olarak gösterir)
![Screenshot_14](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/39f5ae14-9b7b-4e85-9f0d-e8c58b423567)

#### Ürün Oluşturma
![Screenshot_9](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/315f09ff-4adb-4bfa-96ef-e3c5ff9e8b23)

#### Ürün Silme
![Screenshot_10](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/0063def0-a9aa-4b3f-aed1-5404875860f3)

#### Kategori, Marka ve Renk Oluşturma
![Screenshot_11](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/9058b362-4675-4fb2-8e75-e7c310b77dd8)
![Screenshot_12](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/e21a60a7-a0ee-466d-a1b1-7386affd1991)

#### Ürünlerim Sayfası, satın alınan ürünler ve paylaşılan ürünler burda görülür.
![Screenshot_15](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/a10e3056-7958-48f8-a619-cfdd00d0fe8f)
