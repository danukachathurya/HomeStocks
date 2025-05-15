import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiUserGroup,
  HiOutlineUserCircle,
  HiBookmark,
  HiCube,
  HiCog,
  HiArrowSmRight,
  HiClipboardList,
  HiUserAdd,
  HiTrendingUp,
} from "react-icons/hi";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const roleTabs = {
  admin: [
    { key: "overview", label: "Overview", icon: HiHome },
    { key: "manageUsers", label: "Manage Users", icon: HiUserGroup },
    { key: "assignRoles", label: "Assign Roles", icon: HiUserAdd },
    { key: "profile", label: "Your Profile", icon: HiOutlineUserCircle },
    { key: "suppliersOrder", label: "Suppliers Order", icon: HiClipboardList },
  ],
  supplier: [
    { key: "overview", label: "Overview", icon: HiHome },
    { key: "mySupplies", label: "My Supplies", icon: HiClipboardList }, 
    { key: "profile", label: "Your Profile", icon: HiOutlineUserCircle },
    { key: "settings", label: "Settings", icon: HiCog },
  ],
  inventoryManager: [
    { key: "overview", label: "Overview", icon: HiHome },
    { key: "product", label: "Products", icon: HiCube },
    { key: "profile", label: "Your Profile", icon: HiOutlineUserCircle },
    { key: "settings", label: "Settings", icon: HiCog },
  ],
  user: [
    { key: "overview", label: "Overview", icon: HiHome },
    { key: "myItems", label: "My Items", icon: HiBookmark },
    { key: "addPayment", label: "Add Payment", icon: HiTrendingUp },
    { key: "profile", label: "Your Profile", icon: HiOutlineUserCircle },
    { key: "settings", label: "Settings", icon: HiCog },
  ],
};

export default function DashSidebar({ role, activeTab, setActiveTab, onSignOut }) {
  const tabs = roleTabs[role] || [];
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar aria-label="Dashboard Sidebar" className="w-64 min-h-screen">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {tabs.map((tab) => (
            <Sidebar.Item
              key={tab.key}
              icon={tab.icon}
              active={activeTab === tab.key}

              as="div"
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
              {tab.label}
            </Sidebar.Item>
          ))}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

DashSidebar.propTypes = {
  role: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
};