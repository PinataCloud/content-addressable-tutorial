"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LoginButton } from "@/components/login-button";
import { UploadForm } from "@/components/upload-form";

export default function Home() {
  const { ready, authenticated } = usePrivy();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1>Upload and Verify</h1>
      <LoginButton />
      {ready && authenticated && <UploadForm />}
    </main>
  );
}
