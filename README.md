# AI Visual Editor - Joyoda

Güçlü AI destekli görsel düzenleme platformu. Görsel oluşturma, manipülasyon ve geliştirme için çoklu araçlar sunar.

## Özellikler

- **AI Görsel Oluşturma**: Gelişmiş AI modelleri kullanarak metinden görsel oluşturma
- **Görsel Geliştirme**: Görsel kalitesini artırma, büyütme ve iyileştirme
- **Stil Transfer**: Görsellere sanatsal stiller uygulama
- **Yüz Değiştirme**: Görseller arasında yüz değiştirme
- **Sanal Deneme**: Kıyafetleri sanal olarak deneme
- **Video Oluşturma**: Metin veya görsellerden video oluşturma
- **Kredi Sistemi**: Kullanım başına ödeme sistemi (Stripe entegrasyonu)
- **Kullanıcı Kimlik Doğrulama**: Supabase Auth ile güvenli hesaplar

## Teknoloji Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Veritabanı**: Supabase (PostgreSQL)
- **Kimlik Doğrulama**: Supabase Auth
- **AI Servisleri**: Fal.ai
- **Dosya Depolama**: Vercel Blob
- **Ödemeler**: Stripe
- **Deployment**: Vercel

## Yerel Geliştirme Kurulumu

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı
- Fal.ai hesabı
- Vercel hesabı (Blob storage için)
- Stripe hesabı (ödemeler için)

### 1. Klonlama ve Kurulum

\`\`\`bash
git clone <your-repo-url>
cd ai-visual-editor
npm install
\`\`\`

### 2. Ortam Değişkenleri

`.env.local` dosyasını kopyalayın ve API anahtarlarınızı girin:

\`\`\`bash
cp .env.local .env.local.example
# Sonra .env.local dosyasını düzenleyin
\`\`\`

**Gerekli API Anahtarları:**

#### Supabase Kurulumu
1. [supabase.com](https://supabase.com)'da yeni proje oluşturun
2. Settings > API'ye giderek anahtarlarınızı alın:
   - `NEXT_PUBLIC_SUPABASE_URL`: Proje URL'niz
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon/public anahtarınız
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role anahtarınız (gizli tutun)
3. Veritabanı bağlantı stringleri Supabase tarafından otomatik oluşturulur

#### Fal.ai Kurulumu
1. [fal.ai](https://fal.ai)'de hesap oluşturun
2. Dashboard'a giderek API anahtarınızı alın
3. `FAL_KEY`'i ortam değişkenlerinize ekleyin

#### Vercel Blob Kurulumu
1. [vercel.com](https://vercel.com)'da hesap oluşturun
2. Dashboard'da yeni Blob store oluşturun
3. `BLOB_READ_WRITE_TOKEN`'ınızı alın

#### Stripe Kurulumu (Opsiyonel - ödemeler için)
1. [stripe.com](https://stripe.com)'da hesap oluşturun
2. Dashboard'dan secret key'inizi alın
3. `STRIPE_SECRET_KEY`'i ayarlayın

### 3. Veritabanı Kurulumu

Veritabanı tabloları SQL scriptleri çalıştırıldığında otomatik oluşturulacak. Uygulama kapsamlı veritabanı şeması içerir:

- Kullanıcı yönetimi ve kimlik doğrulama
- Kredi sistemi ve işlemler
- AI araç konfigürasyonları
- İş işleme ve analitik
- Kullanıcı tercihleri ve ayarlar

### 4. Geliştirme Sunucusunu Çalıştırma

\`\`\`bash
npm run dev
\`\`\`

Uygulamayı görmek için [http://localhost:3000](http://localhost:3000) adresini açın.

### 5. İlk Kurulum

1. Tarayıcınızda uygulamayı ziyaret edin
2. Kayıt formunu kullanarak hesap oluşturun
3. Veritabanı otomatik olarak AI araçları ve konfigürasyonlarla doldurulacak
4. Test için kredi satın alın veya admin panelinden kredi ekleyin

## Proje Yapısı

\`\`\`
├── app/                    # Next.js app dizini
│   ├── api/               # API rotaları
│   ├── auth/              # Kimlik doğrulama sayfaları
│   ├── credits/           # Kredi yönetimi
│   ├── tools/             # AI araç sayfaları
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── ui/               # UI bileşenleri (shadcn/ui)
│   └── ...               # Özellik bileşenleri
├── lib/                   # Yardımcı kütüphaneler
│   ├── supabase/         # Supabase istemcileri
│   └── utils.ts          # Yardımcı fonksiyonlar
├── scripts/              # Veritabanı scriptleri
└── public/               # Statik dosyalar
\`\`\`

## Mevcut AI Araçları

- **Imagen 4**: Gelişmiş metin-to-görsel oluşturma
- **Image Upscaler**: Görsel çözünürlük ve kalite artırma
- **Face Swap**: Görseller arası yüz değiştirme
- **Style Transfer**: Sanatsal stil uygulama
- **Virtual Try-On**: Kıyafet deneme
- **Character Generation**: Karakter görseli oluşturma
- **Image to Video**: Görsellerden video oluşturma
- **Text to Video**: Metinden video oluşturma

## Deployment

Uygulama Vercel'de deploy edilmek üzere tasarlandı:

1. Kodunuzu GitHub'a push edin
2. Repository'nizi Vercel'e bağlayın
3. Tüm ortam değişkenlerini Vercel dashboard'a ekleyin
4. Deploy edin!

## Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi yapın
4. Kapsamlı test edin
5. Pull request gönderin

## Destek

Sorunlar ve sorular için:
- Dokümantasyonu kontrol edin
- `/scripts` dizinindeki veritabanı şemasını inceleyin
- Tüm ortam değişkenlerinin doğru ayarlandığından emin olun
- API anahtarlarının geçerli olduğunu ve yeterli kredi/kotaya sahip olduğunu doğrulayın

## Türkçe Kurulum Rehberi

### Hızlı Başlangıç
1. **Supabase**: Yeni proje oluştur → API anahtarlarını kopyala
2. **Fal.ai**: Hesap oluştur → API key al
3. **Vercel**: Blob store oluştur → Token al
4. **Stripe**: Hesap oluştur → Secret key al (opsiyonel)
5. Tüm anahtarları `.env.local` dosyasına yapıştır
6. `npm run dev` ile başlat

### Sorun Giderme
- Supabase bağlantı hatası: URL ve anahtarları kontrol edin
- AI araçları çalışmıyor: FAL_KEY'in doğru olduğundan emin olun
- Dosya yükleme sorunu: BLOB_READ_WRITE_TOKEN'ı kontrol edin
- Ödeme sistemi: STRIPE_SECRET_KEY'i doğrulayın
