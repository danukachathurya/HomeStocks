import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiShoppingCart,
  HiDocumentReport,
  HiOutlineUserGroup,
  HiArrowSmRight,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

export default function SupplierDashboard() {
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
      <Sidebar aria-label="Supplier Sidebar" className="w-64">
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
              icon={HiShoppingCart}
              as="div"
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Supply Orders
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiDocumentReport}
              as="div"
              onClick={() => setActiveTab("products")}
              className={activeTab === "products" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              Manage Products
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
        <h1 className="text-2xl font-bold mb-4">Supplier Dashboard</h1>

        {activeTab === "overview" && (
          <p className="text-gray-700">
            Hello <strong>{currentUser?.username}</strong>! Welcome to your supplier dashboard.
          </p>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Supply Orders</h2>
            <p>View and manage your supply orders here.</p>
            {/* Add supply order logic here */}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Product Management</h2>
            <p>Manage your products, update stock status, and more.</p>
            {/* Add product management logic here */}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p>Manage your profile and settings.</p>
            {/* Add profile settings logic here */}
          </div>
        )}
      </div>
    </div>
  );
}
