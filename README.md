
# Ürün Katalog Projesi

Selçuk Üniversitesi Bilgisayar Mühendisliği 4.Sınıf öğrencisi olarak İş Yeri Eğitimim için Primefor Şirketine yaptığım Ürün Katalog Projesi için yaptığım proje. Benden istenilenler:







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
| `username` | `string` | 5 karakterden fazla, sayı ve büyük küçük harf kullanılması gerekir |
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

![Screenshot_8](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/b1bbaf87-0b15-4691-956e-f9002db93169)
![Screenshot_9](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/315f09ff-4adb-4bfa-96ef-e3c5ff9e8b23)
![Screenshot_10](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/0063def0-a9aa-4b3f-aed1-5404875860f3)
![Screenshot_11](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/9058b362-4675-4fb2-8e75-e7c310b77dd8)
![Screenshot_12](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/e21a60a7-a0ee-466d-a1b1-7386affd1991)
![Screenshot_13](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/8c3e6017-dfa3-4c2b-b7ba-f29da9d31cd3)
![Screenshot_14](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/39f5ae14-9b7b-4e85-9f0d-e8c58b423567)
![Screenshot_15](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/a10e3056-7958-48f8-a619-cfdd00d0fe8f)
![Screenshot_16](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/204bb24e-21df-47ac-bf38-c64f5b193d69)
![Screenshot_17](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/8da0b78a-479b-47c3-b063-33df5768dda1)
![Screenshot_18](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/4e10d9f9-29fd-4eb5-9565-bd69a2417549)
![Screenshot_19](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/7df8887d-b4c8-48cc-847e-9523ab1f745c)
![Screenshot_1](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/756a6df7-f5fa-40c7-9b6d-98f8cb22557e)
![Screenshot_2](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/652602e6-9869-4181-b6e7-f340230ec307)
![Screenshot_3](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/ad65e1ec-8d60-4e98-9dd4-7cfcdb274c8f)
![Screenshot_4](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/20eeebe4-1045-410c-8e3c-30e070dfe2fa)
![Screenshot_5](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/fb594d86-daf5-4113-a959-94b133959fd7)
![Screenshot_6](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/91855073-6b3b-4d65-bf4f-9c2edac69b28)
![Screenshot_7](https://github.com/snmeric/UrunKatalogAPI/assets/82456006/5e8ab75b-6749-4242-adf4-27d81dbd21fd)

  
