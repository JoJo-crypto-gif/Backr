import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your donation...");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        setMessage("❌ No reference provided.");
        return;
      }
      console.log("🔍 Starting verification for:", reference);

      try {
        // 1️⃣ Verify with backend
        const verifyRes = await axios.get(`http://localhost:5000/api/payments/verify/${reference}`);
        console.log("🧾 /verify response:", verifyRes.data);

        if (verifyRes.data.status !== "success") {
          throw new Error(verifyRes.data.error || "Verification failed on server");
        }

        const verifiedData = verifyRes.data.data;

        // 2️⃣ Record the transaction
        const recordRes = await axios.post("http://localhost:5000/api/transactions/record", {
          campaignId: verifiedData.campaignId,
          name: verifiedData.name,
          email: verifiedData.email,
          amount: verifiedData.amount,
          reference: verifiedData.reference,
          status: "success",
        });
        console.log("💾 /record response:", recordRes.data);

        if (!recordRes.data.success) {
          throw new Error(recordRes.data.message || "Failed to record transaction");
        }

        // 👍 All good!
        setDetails(verifiedData);
        setStatus("success");
        setMessage("🎉 Thank you for your donation!");
      } catch (err: any) {
        console.error("❌ Verification/Record error:", err.response?.data || err.message);
        setStatus("error");
        setMessage("❌ Could not verify or record your donation.");
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-2xl font-semibold mb-4">{message}</h1>

      {status === "success" && details && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Email:</strong> {details.email}</p>
          <p><strong>Amount:</strong> GHS {details.amount}</p>
          <p><strong>Reference:</strong> {details.reference}</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-red-600 my-4">
          <p>There was a problem processing your donation.</p>
        </div>
      )}

      <a href="/" className="mt-8 text-blue-500 underline">
        Go back to homepage
      </a>
    </div>
  );
}
