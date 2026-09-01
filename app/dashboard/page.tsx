"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="py-20 text-center font-mono text-xs text-zinc-500">
      Redirecting to Dashboard...
    </div>
  );
}
