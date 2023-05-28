
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
  