import { useState } from "react";

export default function AdminPosition() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleAssignRole = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch("/api/admin/assign-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to assign role.");
        setMessageType("error");
      } else {
        setMessage("Role assigned successfully.");
        setMessageType("success");
        setEmail("");
        setRole("user");
      }

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
        Assign Role to User
      </h2>

      {message && (
        <div
          className={`${
            messageType === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-red-50 border-red-400 text-red-700"
          } border px-5 py-3 rounded-md mb-6 text-center font-medium transition-opacity duration-500`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleAssignRole} className="space-y-6 text-base">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-gray-700"
          >
            User Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block mb-2 font-semibold text-gray-700"
          >
            Select Role
          </label>
          <select
            id="role"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="inventorymanager">Inventory Manager</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
        >
          Assign Role
        </button>
      </form>
    </div>
  );
}
