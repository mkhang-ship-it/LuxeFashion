import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get("order_no") || "N/A";
  const total = searchParams.get("total") || "0";

  return (
    <div className="bg-gray-50 py-12 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <section className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been created and is being processed.
          </p>

          <div className="bg-gray-50 rounded-lg p-5 text-left mb-6">
            <p className="text-sm text-gray-500 mb-2">Order Number</p>
            <p className="font-semibold text-gray-900 mb-4">{orderNo}</p>
            <p className="text-sm text-gray-500 mb-2">Total Paid</p>
            <p className="font-semibold text-pink-600">${Number(total).toFixed(2)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile?tab=orders"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

