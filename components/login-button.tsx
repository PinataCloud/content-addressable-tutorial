"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LoginButton() {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      className="border-2 border-black p-2 rounded-md"
      type="submit"
      disabled={disableLogin}
      onClick={login}
    >
      {authenticated ? "Logged In" : "Login"}
    </button>
  );
}
