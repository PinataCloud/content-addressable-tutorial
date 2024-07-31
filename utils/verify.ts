import { verifyTypedData, recoverTypedDataAddress, getAddress } from "viem";
import { domain, types } from "@/utils/712";

export async function verify(cid: string, address: string, date: string) {
  try {
    // Get signature via the gateway
    const signatureReq = await fetch(
      `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`,
      {
        method: "HEAD",
      },
    );
    const signature = signatureReq.headers.get("pinata-signature");
    console.log("signature: ", signature);
    // All the other information provided by our component
    console.log("address: ", address);
    console.log("cid: ", cid);
    console.log("file date: ", date);

    // Recreate the message used in the signature
    const message = {
      address: address,
      cid: cid,
      date: date,
    };
    console.log(message);

    // Verify the signature
    const verify: any = await verifyTypedData({
      address: address as "0x",
      domain: domain as any,
      types: types,
      primaryType: "Sign",
      message,
      signature: signature as "0x",
    });
    console.log(verify);

    // Returns true or false
    return verify;
  } catch (error) {
    console.log(error);
    return error;
  }
}
