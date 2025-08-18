import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // 1. Önce Supabase'in oturum yönetimi işini yapmasına izin ver.
  // Bu, bir "yanıt" (response) nesnesi oluşturur.
  const response = await updateSession(request)

  // 2. Tüm site için geçerli olacak güvenlik kurallarımızı (CSP) tanımla.
  const cspHeader = `
    default-src 'self' 'unsafe-inline' 'unsafe-eval';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.com https://vercel.com https://js.stripe.com https://*.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://*.vercel.com https://vercel.com https://stripe.com https://js.stripe.com https://*.stripe.com https://checkout.stripe.com https://api.stripe.com https://blob.vercel-storage.com https://*.supabase.co https://*.fal.ai https://*.fal.media https://fal.media https://cdn.fshn.ai https://js.stripe.com/ https://*.fshn.ai https://cdn.fashn.ai https://fashn.ai https://*.fashn.ai https://fshn.ai;
    connect-src 'self' https://*.vercel.com https://stripe.com https://js.stripe.com https://*.stripe.com https://checkout.stripe.com https://api.stripe.com https://vercel.com https://blob.vercel-storage.com https://*.supabase.co https://supabase.co wss://*.supabase.co https://*.fal.ai https://*.fal.media https://fal.media https://api.fal.ai https://cdn.fashn.ai https://fashn.ai https://*.fashn.ai https://queue.fal.run https://cdn-api.ethyca.com https://files-vercel.us.files.ethyca.com https://identity.io.app https://cdn.fshn.ai https://*.fshn.ai;
    frame-src 'self' https://vercel.live https://*.vercel.com https://stripe.com https://js.stripe.com https://*.stripe.com https://checkout.stripe.com https://api.stripe.com https://hooks.stripe.com;
    frame-ancestors 'self' https://checkout.stripe.com https://*.stripe.com https://hooks.stripe.com;
    worker-src 'self' blob:;
    child-src 'self' blob: https://checkout.stripe.com https://*.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://checkout.stripe.com https://*.stripe.com https://hooks.stripe.com;
  `
    .replace(/\s{2,}/g, " ")
    .trim() // Fazla boşlukları temizler

  // 3. Supabase'in oluşturduğu yanıtın başlığına (header) kendi CSP kuralımızı ekle.
  response.headers.set("Content-Security-Policy", cspHeader)

  // 4. (Önerilir) Diğer güvenlik başlıklarını da ekleyelim.
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // 5. Hem Supabase'in işini yaptığı hem de bizim kurallarımızı içeren son yanıtı geri döndür.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
