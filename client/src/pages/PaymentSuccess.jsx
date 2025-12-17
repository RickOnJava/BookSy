import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = params.get("orderId");

    if (!orderId) return;

    api
      .post("/auth/grant-access", { orderId })
      .then(() => {
        navigate("/inventory");
      })
      .catch(() => {
        alert("Access grant failed");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold">Payment Successful 🎉</h2>
    </div>
  );
}
