import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import icons from "../ultils/icons";

const { MdKeyboardDoubleArrowRight } = icons;

const Sidebar = () => {
  const { categories } = useSelector((state) => state.app);
  const sortedCategories = Array.isArray(categories)
  ? [...categories]
      .sort((a, b) => a.title.localeCompare(b.title))
      // .slice(0, 10) // Get the first 10 categories
  : [];


  return (
    <div>
      <h2 className="rounded-tr-[20px] rounded-tl-[20px] text-[20px] font-bold px-5 py-3 text-white bg-main text-center">
        Product Categories
      </h2>
      <div className="flex flex-col border border-main border-opacity-40">
        {sortedCategories?.map((el) => (
          <NavLink
            key={el.title}
            to={`/${el.title}`}
            className={({ isActive }) =>
              isActive
                ? " text-main px-5 py-3 text-lg  flex items-center"
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
