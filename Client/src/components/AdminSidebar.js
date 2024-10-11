// import React, { memo, Fragment, useState } from "react";
// import { adminSidebar } from "../ultils/contants";
// import { NavLink, Link } from "react-router-dom";
// import path from "../ultils/path";
// import icons from "../ultils/icons";
// import clsx from "clsx";

// const { FaChevronDown, FaChevronUp, IoHome } = icons;

// const activedStyle =
//   "px-4 py-2 flex items-center gap-2 text-gray-200 bg-[#273526]";
// const notActivedStyle =
//   "px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-[#45624E]";

// const AdminSidebar = () => {
//   const [actived, setActived] = useState([]);
//   const handleShowTab = (tabId) => {
//     if (actived.some((el) => el === tabId))
//       setActived((prev) => prev.filter((el) => el !== tabId));
//     else setActived((prev) => [...prev, tabId]);
//   };
//   return (
//     <div className="">
//       <div className="flex flex-col items-center justify-center gap-2 p-4 text-white">
//         <h3 className="text-[34px] font-bold">VIEEN'S STORE</h3>
//         <span>Admin Workspace</span>
//       </div>
      
//       <div>
//         {adminSidebar.map((el) => (
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
//                         key={`${el.text}-${item.text}`}
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
//       </div>
//     </div>
//   );
// };

// export default memo(AdminSidebar);


import React, { memo, Fragment, useState } from "react";
import { adminSidebar } from "../ultils/contants";
import { NavLink } from "react-router-dom";
import icons from "../ultils/icons";
import clsx from "clsx";

const { FaChevronDown, FaChevronUp } = icons;

const activedStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 bg-[#273526]";
const notActivedStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-[#45624E]";

const AdminSidebar = () => {
  const [actived, setActived] = useState([]);

  const handleShowTab = (tabId) => {
    if (actived.some((el) => el === tabId))
      setActived((prev) => prev.filter((el) => el !== tabId));
    else setActived((prev) => [...prev, tabId]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header section - fixed */}
      <div className="flex rounded-full flex-col items-center justify-center gap-2 p-4 text-white bg-main">
        <h3 className="text-[34px] font-bold">VIEEN'S STORE</h3>
        <span>Admin Workspace</span>
      </div>

      {/* Scrollable section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {adminSidebar.map((el) => (
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
                className=" flex flex-col text-gray-200 "
              >
                <div className="px-4 py-2 flex justify-between items-center gap-2  hover:bg-[#45624E]">
                  <div className="flex items-center gap-2">
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {actived.some((id) => id === +el.id) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>

                {actived.some((id) => +id === +el.id) && (
                  <div className="flex flex-col">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={`${el.text}-${item.text}`}
                        to={item.path}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && notActivedStyle,
                            "pl-10"
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
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
