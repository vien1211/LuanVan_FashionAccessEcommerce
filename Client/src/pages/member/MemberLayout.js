import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import { MemberSidebar } from "../../components";

const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  if (!isLoggedIn || !current)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;

  return (
    <div className="flex flex-col w-main mx-auto min-h-screen p-4">
      {/* Sidebar Section */}

      <div className="mb-6">
        <MemberSidebar />
      </div>

      {/* Content Section */}
      <div className="flex flex-col px-6 w-main mx-auto">
        
          <div className="text-main bg-[#F5F5FA] shadow-md rounded-[25px] h-full">
            <Outlet />
        
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
