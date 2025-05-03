import { useEffect, useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/admin/assign-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: selectedUserId, role: selectedRole }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Role assigned successfully!");
    } else {
      alert(data.message || "Failed to assign role.");
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <Label htmlFor="user">Select User</Label>
        <Select
          id="user"
          onChange={(e) => setSelectedUserId(e.target.value)}
          required
        >
          <option value="">-- Choose a user --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email} ({user.role || "No Role"})
            </option>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="role">Select Role</Label>
        <Select
          id="role"
          onChange={(e) => setSelectedRole(e.target.value)}
          required
        >
          <option value="">-- Choose a role --</option>
          <option value="inventorymanager">Inventory Manager</option>
          <option value="supplier">Supplier</option>
          <option value="user">User</option>
        </Select>
      </div>
      <Button onClick={handleAssignRole} gradientDuoTone="purpleToPink">
        Assign Role
      </Button>
    </div>
  );
}
