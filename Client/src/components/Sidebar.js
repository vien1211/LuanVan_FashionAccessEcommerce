// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import icons from "../ultils/icons";

// const { MdKeyboardDoubleArrowRight } = icons;

// const Sidebar = () => {
//   const { categories } = useSelector((state) => state.app);
//   const sortedCategories = Array.isArray(categories)
//   ? [...categories]
//       .sort((a, b) => a.title.localeCompare(b.title))
//       // .slice(0, 10) // Get the first 10 categories
//   : [];


//   return (
//     <div>
//       <h2 className="rounded-tr-[20px] rounded-tl-[20px] text-[20px] font-bold px-5 py-3 text-white bg-main text-center">
//         Product Categories
//       </h2>
//       <div className="flex flex-col border border-main border-opacity-40">
//         {sortedCategories?.map((el) => (
//           <NavLink
//             key={el.title}
//             to={`/${el.title}`}
//             className={({ isActive }) =>
//               isActive
//                 ? " text-main px-5 py-3 text-lg  flex items-center"
//                 : "px-5 py-3 text-lg hover:text-main flex items-center"
//             }
//           >
//             <MdKeyboardDoubleArrowRight className="mr-3" />
//             {el.title}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import icons from "../ultils/icons";

const { MdKeyboardDoubleArrowRight, IoIosArrowDown } = icons;

const Sidebar = () => {
  const { categories } = useSelector((state) => state.app);
  const sortedCategories = Array.isArray(categories)
    ? [...categories].sort((a, b) => a.title.localeCompare(b.title))
    : [];
  
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? sortedCategories : sortedCategories.slice(0, 5);

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  return (
    <div className="flex flex-col">
      <div onClick={toggleShowAll} className="flex items-center justify-between gap-2 border-t border-r border-l border-main border-opacity-40 rounded-tr-[20px] rounded-tl-[20px] text-[20px] font-semibold px-6 py-3 text-main bg-[#f2f7f4] text-center cursor-pointer hover:bg-main hover:text-white">
        Categories
        {showAll ? <IoIosArrowDown size={16} className="rotate-[180deg]"/> : <IoIosArrowDown size={16}/>}
      </div>
      <div className="flex flex-col shadow-md border border-main border-opacity-40 rounded-br-[20px] rounded-bl-[20px]">
        {displayedCategories.map((el) => (
          <NavLink
            key={el.title}
            to={`/${el.title}`}
            className={({ isActive }) =>
              isActive
                ? "text-main px-5 py-3 text-lg flex items-center"
                : "px-5 py-3 text-lg hover:text-main flex items-center"
            }
          >
            <MdKeyboardDoubleArrowRight className="mr-3" />
            {el.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
