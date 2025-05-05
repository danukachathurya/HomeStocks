import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiClipboardList,
  HiCube,
  HiOutlineUserGroup,
  HiArrowSmRight,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

export default function InventoryManagerDashboard() {
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
      <Sidebar aria-label="Inventory Manager Sidebar" className="w-64">
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
              icon={HiClipboardList}
              as="div"
              onClick={() => setActiveTab("inventory")}
              className={activeTab === "inventory" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Manage Inventory
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiCube}
              as="div"
              onClick={() => setActiveTab("suppliers")}
              className={activeTab === "suppliers" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Supplier Coordination
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineUserGroup}
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
        <h1 className="text-2xl font-bold mb-4">Inventory Manager Dashboard</h1>

        {activeTab === "overview" && (
          <p className="text-gray-700">
            Hello <strong>{currentUser?.username}</strong>! Welcome to your inventory manager dashboard.
          </p>
        )}

        {activeTab === "inventory" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Inventory Management</h2>
            <p>View and update inventory status, restock alerts, and more.</p>
            {/* Add inventory management logic here */}
          </div>
        )}

        {activeTab === "suppliers" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Supplier Coordination</h2>
            <p>Communicate with suppliers and track deliveries.</p>
            {/* Add supplier coordination logic here */}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p>Manage your profile and preferences.</p>
            {/* Add profile settings logic here */}
          </div>
        )}
      </div>
    </div>
  );
}
