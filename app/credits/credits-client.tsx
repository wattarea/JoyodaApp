// app/credits/credits-client.tsx

"use client"; // Bu dosyanın bir istemci bileşeni olduğunu belirtiyoruz.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// Projenizde kullanılan diğer UI bileşenlerini buraya import edin...

// Gelen verinin tipini belirliyoruz. user tipi projenizde farklı olabilir, any şimdilik iş görür.
interface CreditsClientProps {
  user: any;
  initialCredits: number;
}

export function CreditsPageClient({ user, initialCredits }: CreditsClientProps) {
  const [currentCredits, setCurrentCredits] = useState(initialCredits);
  const [purchaseAmount, setPurchaseAmount] = useState(100);

  // Bu fonksiyonların içini projenizdeki mantığa göre doldurmanız gerekebilir.
  const handlePurchase = async () => {
    alert(`Satın alma işlemi: ${purchaseAmount} kredi`);
    // Burada satın alma API'nizi çağırabilirsiniz.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Kredi Yönetimi</CardTitle>
          <CardDescription>Mevcut kredilerinizi görüntüleyin ve yeni kredi satın alın.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Mevcut Krediniz:</span>
            <span className="text-2xl font-bold text-primary">{currentCredits}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Satın Alınacak Kredi Miktarı</Label>
            <Input
              id="credits"
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              min="1"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePurchase}>
            Kredi Satın Al
          </Button>
        </CardFooter>
      </Card>
      {user && (
        <div className="mt-4 text-sm text-gray-500">
          Giriş yapan kullanıcı: {user.email}
        </div>
      )}
    </div>
  );
}