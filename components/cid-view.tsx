"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { verify } from "@/utils/verify";

export function CidView({ data, cid }: any) {
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [verified, setVerified] = useState(false);
  const [address, setAddress] = useState("");

  function handleAddress(event: any) {
    setAddress(event.target.value);
  }

  async function verifyContent() {
    try {
      setVerifyLoading(true);
      // Check that the provided address is valid
      const validAddress = isAddress(address);
      if (!validAddress) {
        alert("invalid address");
        setVerifyLoading(false);
        return;
      }
      // API call to verify the content
      const isVerified = await verify(cid, address, data[0].date_pinned);
      if (!isVerified) {
        setVerified(false);
        setVerifyLoading(false);
        setComplete(true);
        return;
      }
      setVerified(isVerified);
      setVerifyLoading(false);
      setComplete(true);
    } catch (error) {
      console.log(error);
      setVerifyLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1>Verify</h1>
      <h2>{cid}</h2>
      <input type="text" onChange={handleAddress} placeholder="address" />
      <button onClick={verifyContent} type="submit">
        Submit
      </button>
      {verified ? "OK" : "Not verified"}
    </div>
  );
}
