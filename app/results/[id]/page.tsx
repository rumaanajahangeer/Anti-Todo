"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResultsRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/analyze?id=${id}`);
    } else {
      router.replace("/analyze");
    }
  }, [id, router]);

  return (
    <div className="py-20 text-center font-mono text-xs text-zinc-500">
      Redirecting to Analyze workspace...
    </div>
  );
}
