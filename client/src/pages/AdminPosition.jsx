import { useState } from "react";

export default function AdminPosition() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleAssignRole = async (e) => {
    e.preventDefault();
    setMessage("");

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
      } else {
        setMessage("Role assigned successfully.");
        setEmail("");
        setRole("user");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assign Role to User</h2>
      <form onSubmit={handleAssignRole} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">User Email</label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium">Select Role</label>
          <select
            id="role"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Role
        </button>

        {message && (
          <p className="mt-2 text-sm text-center text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
