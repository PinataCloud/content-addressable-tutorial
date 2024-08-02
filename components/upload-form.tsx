"use client";

import { generatePinataKey, uploadFile } from "@/utils/upload";
import { getAccessToken, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { domain, types } from "@/utils/712";

export function UploadForm() {
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState("");
  const { ready, wallets } = useWallets();

  function fileHandler(event: any) {
    const file = event?.target?.files[0];
    setSelectedFile(file);
  }
  async function submitHandler() {
    try {
      setLoading(true);
      const accessToken: string | null = await getAccessToken();
      const keys = await generatePinataKey(accessToken);
      // Upload the selected file
      const uploadData = await uploadFile(selectedFile, keys.JWT);
      const wallet = wallets[0];
      // Prepare the message to be signed
      const message = {
        address: wallet.address,
        cid: uploadData?.IpfsHash,
        date: uploadData?.Timestamp,
      };
      // Prepare the sign data payload
      const typedData = {
        primaryType: "Sign",
        domain: domain,
        types: types,
        message: message,
      };
      // sign with user's connected wallet
      await wallet.switchChain(1);
      const provider = await wallet.getEthereumProvider();
      const signature = await provider.request({
        method: "eth_signTypedData_v4",
        params: [wallet.address, JSON.stringify(typedData)],
      });
      console.log(signature);

      // Make API call to register signature with CID with Pinata
      const sign = await fetch("/api/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          signature: signature,
          IpfsHash: uploadData?.IpfsHash,
        }),
      });
      if (sign.status === 401) {
        console.log("Content already signed");
        setLoading(false);
        return;
      }
      const signConfirm = await sign.json();
      console.log(signConfirm);
      setCid(uploadData.IpfsHash);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <h1>Choose a file to upload</h1>
      <input type="file" onChange={fileHandler} />
      <button
        onClick={submitHandler}
        type="submit"
        className="p-2 rounded-md border-2 border-black"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {cid && (
        <a
          href={`/content/${cid}`}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {cid}
        </a>
      )}
    </div>
  );
}
