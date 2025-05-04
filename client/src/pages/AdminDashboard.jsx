import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiUserAdd,
  HiUserGroup,
  HiOutlineUserCircle,
  HiArrowSmRight,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

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
      <Sidebar aria-label="Admin Sidebar" className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              icon={HiHome}
              as="div"
              onClick={() => setActiveTab("overview")}
              className={activeTab === "overview" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Overview
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiUserAdd}
              as="div"
              onClick={() => setActiveTab("assignRoles")}
              className={activeTab === "assignRoles" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Assign Roles
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiUserGroup}
              as="div"
              onClick={() => setActiveTab("manageUsers")}
              className={activeTab === "manageUsers" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Manage Users
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineUserCircle}
              as="div"
              onClick={() => setActiveTab("profile")}
              className={activeTab === "profile" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Your Profile
            </Sidebar.Item>
            <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignOut}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {activeTab === "overview" && (
          <p className="text-gray-700">
            Hello <strong>{currentUser?.username}</strong>! Welcome to your admin dashboard.
          </p>
        )}

        {activeTab === "assignRoles" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Assign Roles</h2>
            <p>Assign Inventory Manager or Supplier roles to users.</p>
            {/* Include your role assignment logic or component here */}
          </div>
        )}

        {activeTab === "manageUsers" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <p>View, edit, or delete user accounts.</p>
            {/* Include your user management logic or component here */}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p>Manage your profile and preferences.</p>
            {/* Add admin profile management logic here */}
          </div>
        )}
      </div>
    </div>
  );
}
