import { useEffect, useState } from "react";

export default function AdminSuppliersOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/supplier-orders", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch supplier orders.");
        }

        setOrders(data.supplies || []);
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading supplier orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Supplier</th>
            <th className="py-2 px-4">Item</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Purchase Date</th>
            <th className="py-2 px-4">Expiry Date</th>
            <th className="py-2 px-4">Code(s)</th>
            <th className="py-2 px-4">Image</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t border-gray-300">
              <td className="py-2 px-4">{order.category}</td>
              <td className="py-2 px-4">{order.supplierName}</td>
              <td className="py-2 px-4">{order.itemName}</td>
              <td className="py-2 px-4">${order.price}</td>
              <td className="py-2 px-4">{order.quantity}</td>
              <td className="py-2 px-4">{new Date(order.purchaseDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{new Date(order.expiryDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{order.itemCode.join(", ")}</td>
              <td className="py-2 px-4">
                <img src={order.itemImage} alt="Item" className="h-10 w-10 object-cover" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
