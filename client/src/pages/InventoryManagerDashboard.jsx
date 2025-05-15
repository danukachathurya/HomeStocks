import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiClipboardList,
  HiCube,
  HiOutlineUserGroup,
  HiArrowSmRight,
  HiClock,
  HiOutlineBan,
  HiTrendingUp,
  HiTrash,
  HiEye,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import Product from "./Product";
import DashProfile from "../components/DashProfile";
import ExpireSoon from "../pages/ExpireSoon";
import ExpiredProduct from "../pages/ExpiredProduct";
import DisposalItems from "../pages/DisposalItems";
import DisposeDetails from "../pages/DisposeDetails";
import UpcomingOrders from "./UpcomingOrders";
import InventoryOverview from "./InventoryOverview";

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
              className={
                activeTab === "overview" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Overview
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineUserGroup}
              as="div"
              onClick={() => setActiveTab("profile")}
              className={
                activeTab === "profile" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Your Profile
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiCube}
              as="div"
              onClick={() => setActiveTab("product")}
              className={
                activeTab === "product" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Products
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiClock}
              as="div"
              onClick={() => setActiveTab("expire-soon")}
              className={
                activeTab === "expire-soon"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
            >
              Expire Soon
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineBan}
              as="div"
              onClick={() => setActiveTab("expired-products")}
              className={
                activeTab === "expired-products"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
            >
              Expired Products
            </Sidebar.Item>

            <Sidebar.Item
              icon={HiClipboardList}
              as="div"
              onClick={() => setActiveTab("upcoming-orders")}
              className={
                activeTab === "upcoming-orders"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
            >
              Upcoming Orders
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiTrash}
              as="div"
              onClick={() => setActiveTab("disposal")}
              className={
                activeTab === "disposal" ? "bg-gray-200 dark:bg-gray-700" : ""
              }
            >
              Disposal Products
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiEye}
              as="div"
              onClick={() => setActiveTab("show-disposal")}
              className={
                activeTab === "show-disposal"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
            >
              Show Disposal
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
          <div>
            <p className="text-gray-700">
              Hello <strong>{currentUser?.username}</strong>! Welcome to your
              inventory manager dashboard.
            </p>
            <InventoryOverview />
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <DashProfile />
          </div>
        )}

        {activeTab === "product" && (
          <div>
            <Product />
          </div>
        )}

        {activeTab === "expire-soon" && (
          <div>
            <ExpireSoon />
          </div>
        )}

        {activeTab === "expired-products" && (
          <div>
            <ExpiredProduct />
          </div>
        )}

        {activeTab === "upcoming-orders" && (
          <div>
            <UpcomingOrders />
          </div>
        )}

        {activeTab === "disposal" && (
          <div>
            <DisposalItems />
          </div>
        )}

        {activeTab === "show-disposal" && (
          <div>
            <DisposeDetails />
          </div>
        )}
      </div>
    </div>
  );
}
