import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiOutlineUserCircle,
  HiBookmark,
  HiCog,
  HiArrowSmRight,
  HiCreditCard
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import Home from "./Home"; // Update path based on your structure
import DashProfile from "../components/DashProfile"; // Update path based on your structure
import MyItems from "./MyItems";
import Checkout from "./Checkout";

export default function UserDashboard() {
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
      <Sidebar aria-label="User Sidebar" className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              icon={HiHome}
              as="div"
              onClick={() => setActiveTab("overview")}
              className={
                activeTab === "overview" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Overview
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiBookmark}
              as="div"
              onClick={() => setActiveTab("myItems")}
              className={
                activeTab === "myItems" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              My Items
            </Sidebar.Item>

            <Sidebar.Item
              icon={HiCreditCard}
              as="div"
              onClick={() => setActiveTab("checkout")}
              className={
                activeTab === "checkout" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Checkout
            </Sidebar.Item>

            <Sidebar.Item
              icon={HiOutlineUserCircle}
              as="div"
              onClick={() => setActiveTab("profile")}
              className={
                activeTab === "profile" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Your Profile
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiCog}
              as="div"
              onClick={() => setActiveTab("settings")}
              className={
                activeTab === "settings" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Settings
            </Sidebar.Item>
            <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignOut}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

        {activeTab === "overview" && (
          <div>
            <p className="text-gray-700">
              Hello <strong>{currentUser?.username}</strong>! Welcome to your
              user dashboard.
            </p>
            <Home />
          </div>
        )}

        {activeTab === "myItems" && (
          <div>
            <MyItems onProceedToCheckout={() => setActiveTab("checkout")} />
          </div>
        )}

        {activeTab === "checkout" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Checkout</h2>
            <p>View your saved or purchased items here.</p>
            <Checkout />
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <DashProfile />
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p>Adjust application preferences or update credentials.</p>
            {/* Add settings logic here */}
          </div>
        )}
      </div>
    </div>
  );
}
