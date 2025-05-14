import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/get-users", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/delete-user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setSuccessMessage("User deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-center text-gray-500">Loading users...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      

      {/* Search Input - full width */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by username, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 text-green-800 border border-green-400 px-4 py-3 rounded shadow-sm">
          {successMessage}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-5 text-left">Username</th>
              <th className="py-3 px-5 text-left">Email</th>
              <th className="py-3 px-5 text-left">Role</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-5">{user.username}</td>
                <td className="py-3 px-5">{user.email}</td>
                <td className="py-3 px-5 capitalize">{user.role}</td>
                <td className="py-3 px-5">
                  {user.role === "admin" ? (
                    <span className="text-gray-400 italic">Cannot delete</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline hover:text-red-800 font-medium transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <p className="p-4 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}
