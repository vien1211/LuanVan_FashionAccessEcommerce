import React, { memo, Fragment, useState } from "react";
import { memberSidebar } from "../ultils/contants";
import { NavLink, Link } from "react-router-dom";
import path from "../ultils/path";
import icons from "../ultils/icons";
import clsx from "clsx";
import { useSelector } from "react-redux";
import avt from '../assets/avtDefault.avif'

const { FaChevronDown, FaChevronUp, IoHome } = icons;

const activedStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 bg-[#273526]";
const notActivedStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-[#45624E]";

const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const handleShowTab = (tabId) => {
    if (actived.some((el) => el === tabId))
      setActived((prev) => prev.filter((el) => el !== tabId));
    else setActived((prev) => [...prev, tabId]);
  };

  const {current} = useSelector(state => state.user)
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-white">
        <h3 className="text-[34px] font-bold">VIEEN'S STORE</h3>
        <span>Personal </span>
        <img src={current?.avatar || avt} alt='avt' className="w-16 h-16 object-cover rounded-full" />
        <small>{`${current?.lastname} ${current?.firstname}`}</small>
      </div>
      
      <div>
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
                        key={el.text}
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

export default memo(MemberSidebar);
