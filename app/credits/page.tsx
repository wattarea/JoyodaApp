// app/credits/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from "@/lib/supabase/server"; // Sunucu istemcisi
import { redirect } from "next/navigation";
import { CreditsPageClient } from "./credits-client"; // Az önce oluşturduğumuz istemci bileşenini import ediyoruz

export default async function CreditsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Kullanıcının veritabanındaki diğer bilgilerini (örneğin kredi sayısını) burada çekebilirsiniz.
  // Örnek bir veri çekme işlemi (profiles tablonuz olduğunu varsayarak):
  const { data: userData, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  // Hata yönetimi veya başlangıç değeri atama
  const initialCredits = userData ? userData.credits : 0;

  // Sunucu bileşeni, veriyi çeker ve bunu bir prop olarak istemci bileşenine gönderir.
  return <CreditsPageClient user={user} initialCredits={initialCredits} />;
}