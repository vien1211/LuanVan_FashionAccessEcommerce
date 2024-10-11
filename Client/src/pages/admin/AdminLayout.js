import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import { AdminSidebar } from "../../components";

const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  if (!isLoggedIn || !current || +current.role !== 99)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return (
    <div className="flex w-full min-h-screen bg-gray-300 text-white">
      {/* Sidebar Section */}
      <div className="w-[330px] rounded-[25px] m-6 bg-main fixed top-0 bottom-0 ">
        <AdminSidebar />
      </div>

      {/* Content Section */}
      <div className="flex-1 ml-[360px] p-6 overflow-hidden">
        <div className="bg-white text-main rounded-[25px] p-6 h-full">
          <div className=" bg-[#F5F5FA] shadow-md rounded-[25px] h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          
            <Outlet />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
