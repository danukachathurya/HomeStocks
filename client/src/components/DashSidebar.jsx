import { Sidebar } from "flowbite-react";
import {
  HiTrash,
  HiEye,
  HiArrowSmRight,
  HiChartPie,
  HiTrendingUp,
  HiOutlineUserGroup,
  HiClock,
  HiUser,
  HiCube
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

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

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {
            currentUser && currentUser.isAdmin && (
              <>
                <Link to='/dashboard?tab=dash'>
                  <Sidebar.Item
                    active={tab === 'dash' || !tab}
                    icon={HiChartPie}
                    as='div'
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
                    Users
                  </Sidebar.Item>
                </Link>
              </>
            )
          }
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=products">
            <Sidebar.Item
              active={tab === "products"}
              icon={HiCube}
              as="div"
            >
              Products
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=expire-soon">
            <Sidebar.Item
              active={tab === "expire-soon"}
              icon={HiClock}
              as="div"
            >
              Expire Soon
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=high-demand">
            <Sidebar.Item
              active={tab === "high-demand"}
              icon={HiTrendingUp}
              as="div"
            >
              Demand Products
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=disposal">
            <Sidebar.Item
              active={tab === "disposal"}
              icon={HiTrash}
              as="div"
            >
              Disposal Products
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=show-disposal">
            <Sidebar.Item
              active={tab === "show-disposal"}
              icon={HiEye}
              as="div"
            >
              Show Disposal
            </Sidebar.Item>
          </Link>

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
