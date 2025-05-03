import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
  HiPlus
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const role = currentUser?.role?.toLowerCase(); // Normalize for comparison

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">

          {/* Admin only */}
          {role === 'admin' && (
            <>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Manage Users
                </Sidebar.Item>
              </Link>
            </>
          )}

          {/* Supplier only */}
          {role === 'supplier' && (
            <Link to="/dashboard?tab=supplier-products">
              <Sidebar.Item
                active={tab === "supplier-products"}
                icon={HiDocumentText}
                as="div"
              >
                Supplier Products
              </Sidebar.Item>
            </Link>
          )}

          {/* Inventory Manager only */}
          {role === 'inventory manager' && (
            <Link to="/dashboard?tab=inventory">
              <Sidebar.Item
                active={tab === "inventory"}
                icon={HiAnnotation}
                as="div"
              >
                Inventory
              </Sidebar.Item>
            </Link>
          )}

          {/* Shared across all roles */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=products">
            <Sidebar.Item
              active={tab === "products"}
              icon={HiPlus}
              as="div"
            >
              Products
            </Sidebar.Item>
          </Link>

          {/* Sign out */}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
