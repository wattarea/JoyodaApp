// app/credits/page.tsx

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreditsPageClient } from "./credits-client" // İstemci bileşenini import ediyoruz

export const dynamic = "force-dynamic"

// Bu fonksiyon sunucuda çalışır. 'use client' direktifi yok!
export default async function CreditsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Eğer kullanıcı giriş yapmamışsa, signin sayfasına yönlendir
  if (!user) {
    redirect("/signin")
  }

  // Kullanıcının kredi bilgisini veritabanından çek
  // 'users' ve 'credits' kısımlarını kendi veritabanı şemanıza göre güncelleyebilirsiniz.
  const { data: userData } = await supabase.from("users").select("credits").eq("email", user.email).single()

  // Toplanan veriyi, görsel arayüzü yönetecek olan istemci bileşenine props olarak gönder
  return <CreditsPageClient user={user} initialCredits={userData?.credits || 0} />
}
