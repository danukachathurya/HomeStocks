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
    <div className="w-full max-w-2xl mx-auto p-12 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">Assign Role to User</h2>

      {message && (
        <div
          className={`${
            messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          } px-4 py-2 rounded mb-4 transition-opacity duration-500`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleAssignRole} className="space-y-6 text-lg">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            User Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md text-base"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block font-medium mb-1">
            Select Role
          </label>
          <select
            id="role"
            className="w-full px-4 py-2 border rounded-md text-base"
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
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
        >
          Assign Role
        </button>
      </form>
    </div>
  );
}
