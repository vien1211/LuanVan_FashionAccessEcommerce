// import React, { memo, Fragment, useState } from "react";
// import { memberSidebar } from "../ultils/contants";
// import { NavLink, Link, useNavigate } from "react-router-dom";
// import path from "../ultils/path";
// import icons from "../ultils/icons";
// import clsx from "clsx";
// import { useSelector, useDispatch } from "react-redux";
// import avt from "../assets/avtDefault.avif";
// import { logout } from "../store/user/userSlice";
// import { getCurrentUser } from "../store/user/asyncActions";
// import { RiLogoutCircleLine, RiLogoutCircleRLine } from "react-icons/ri";

// const { FaChevronDown, FaChevronUp, IoHome } = icons;

// const activedStyle =
//   "px-4 py-2 flex items-center gap-2 text-gray-200 bg-[#273526]";
// const notActivedStyle =
//   "px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-[#45624E]";

// const MemberSidebar = () => {
//   const [actived, setActived] = useState([]);
//   const handleShowTab = (tabId) => {
//     if (actived.some((el) => el === tabId))
//       setActived((prev) => prev.filter((el) => el !== tabId));
//     else setActived((prev) => [...prev, tabId]);
//   };

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { current } = useSelector((state) => state.user);

//   const handleLogout = () => {
//     dispatch(logout()); 
//     navigate(`/${path.HOME}`); 
//   };

//   return (
//     <div className="">
//       <div className="flex flex-col gap-2 p-4 text-white border-b">
//         <h3 className="text-[34px] font-bold">VIEEN'S STORE</h3>

//         <img
//           src={current?.avatar || avt}
//           alt="avt"
//           className="w-[150px] h-[150px] border-2 border-[#82b57e] object-cover rounded-full"
//         />
//         <small>{`${current?.lastname} ${current?.firstname}`}</small>
//         <small>{`${current?.email}`}</small>
//       </div>

//       <div className="flex gap-2">
//         {memberSidebar.map((el) => (
//           <Fragment key={el.id}>
//             {el.type === "SINGLE" && (
//               <NavLink
//                 to={el.path}
//                 className={({ isActive }) =>
//                   clsx(isActive && activedStyle, !isActive && notActivedStyle)
//                 }
//               >
//                 <span>{el.icon}</span>
//                 <span>{el.text}</span>
//               </NavLink>
//             )}
//             {el.type === "PARENT" && (
//               <div
//                 onClick={() => handleShowTab(+el.id)}
//                 className=" flex flex-col text-gray-200 "
//               >
//                 <div className="px-4 py-2 flex justify-between items-center gap-2  hover:bg-[#45624E]">
//                   <div className="flex items-center gap-2">
//                     <span>{el.icon}</span>
//                     <span>{el.text}</span>
//                   </div>
//                   {actived.some((id) => id === +el.id) ? (
//                     <FaChevronUp />
//                   ) : (
//                     <FaChevronDown />
//                   )}
//                 </div>

//                 {actived.some((id) => +id === +el.id) && (
//                   <div className="flex flex-col">
//                     {el.submenu.map((item) => (
//                       <NavLink
//                         key={el.text}
//                         to={item.path}
//                         onClick={(e) => e.stopPropagation()}
//                         className={({ isActive }) =>
//                           clsx(
//                             isActive && activedStyle,
//                             !isActive && notActivedStyle,
//                             "pl-10"
//                           )
//                         }
//                       >
//                         {item.text}
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//             )}
            
//           </Fragment>
//         ))}

//         <div 
//           onClick={handleLogout} 
//           className={notActivedStyle + " w-full"}
//         >
//           <RiLogoutCircleRLine size={20} />
//           <span>Logout</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(MemberSidebar);


import React, { memo, Fragment, useState } from "react";
import { memberSidebar } from "../ultils/contants";
import { Link, NavLink, useNavigate } from "react-router-dom";
import path from "../ultils/path";
import icons from "../ultils/icons";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import avt from "../assets/avtDefault.avif";
import { logout } from "../store/user/userSlice";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { BsPatchPlus } from "react-icons/bs";

const { FaChevronDown, FaChevronUp } = icons;

const activedStyle =
  "px-4 py-1 rounded-full flex items-center gap-2 text-gray-200 bg-[#273526]";
const notActivedStyle =
  "px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#45624E] hover:text-white";

const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const handleShowTab = (tabId) => {
    if (actived.some((el) => el === tabId))
      setActived((prev) => prev.filter((el) => el !== tabId));
    else setActived((prev) => [...prev, tabId]);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/${path.HOME}`);
  };

  return (
    <div className="flex w-main h-[230px] flex-col items-start border-b p-1 ">
      {/* User Info */}
      <div className="flex w-full p-[1rem] flex-row justify-between items-center gap-4 bg-[#eaf3eff0] text-[#5B7C65] rounded-[20px] shadow-md">
        <div className="flex items-center">
        <img
          src={current?.avatar || avt}
          alt="avatar"
          className="w-[130px] h-[130px] border-2 border-[#a0c29d] object-cover rounded-full"
        />
        <div className="flex flex-col">
          <h3 className="font-bold text-[32px] py-2 px-4">{`${current?.lastname} ${current?.firstname}`}</h3>
          <small className="px-4">{current?.email}</small>
        </div>
        </div>

        <div className="flex">
          <Link
            to={`/${path.MEMBER}/${path.M_BLOG}`}
            className="flex gap-2 justify-center py-4 px-3 text-main bg-[#eef1ef] shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-l before:to-main before:from-[#d8ecdf] 
                 before:translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-0
                 hover:text-white hover:shadow-lg ease-in-out transform hover:scale-105"
          >
            <BsPatchPlus className="my-auto z-10" size={24} />
            <span className="z-10">Create Blog Post</span>
          </Link>
        </div>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-row gap-4 mt-4 flex-wrap">
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  clsx(isActive && activedStyle, !isActive && notActivedStyle)
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div
                onClick={() => handleShowTab(+el.id)}
                className="flex flex-col text-gray-200"
              >
                <div className="flex flex-row items-center gap-2 hover:bg-[#45624E]">
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                  {actived.some((id) => id === +el.id) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>

                {actived.some((id) => +id === +el.id) && (
                  <div className="flex flex-col pl-4">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={item.text}
                        to={item.path}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && notActivedStyle
                          )
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}

        {/* Logout Button */}
        <div onClick={handleLogout} className={notActivedStyle}>
          <RiLogoutCircleRLine size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default memo(MemberSidebar);

