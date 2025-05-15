import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import DashSidebar from "../components/DashSidebar"; // Update path based on your structure
import AdminPosition from "./AdminPosition";
import ManageUsers from "./ManageUsers"; // Update path based on your structure
import AdminSuppliersOrder from "./AdminSuppliersOrder";
import DashProfile from "../components/DashProfile"; // Update path based on your structure
import AdminOverview from "./AdminOverview"; // Update path based on your structure

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message || "Sign out failed");
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */} 
      <DashSidebar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {activeTab === "overview" && (
          <div>
            <p className="text-gray-700">
              Hello <strong>{currentUser?.username}</strong>! Welcome to your
              admin dashboard.
            </p>
            <AdminOverview />
          </div>
        )}

        {activeTab === "assignRoles" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Assign Roles</h2>
            <p>Assign Inventory Manager or Supplier roles to users.</p>
            <AdminPosition />
          </div>
        )}

        {activeTab === "manageUsers" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <p>View or delete user accounts.</p>
            <ManageUsers />
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <DashProfile />
          </div>
        )}

        {activeTab === "suppliersOrder" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Supplier Orders</h2>
            <AdminSuppliersOrder />
          </div>
        )}
      </div>
    </div>
  );
}
