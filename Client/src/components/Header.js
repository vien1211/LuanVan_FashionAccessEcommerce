


import React, { Fragment, useEffect, useState } from "react";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../assets/avtDefault.avif";
import { logout } from "../store/user/userSlice";
import { getCurrentUser } from "../store/user/asyncActions";
import Navigation from "./Navigation";
import { showCart } from "../store/app/appSlice";

const { FaShippingFast, FaMoneyCheck, MdCurrencyExchange,  HiShoppingBag, RiLogoutCircleRLine } = icons;

const Header = () => {
  const [showOption, setShowOption] = useState(false);
  const [isHeaderSmall, setIsHeaderSmall] = useState(false);
  const [isInfoHidden, setIsInfoHidden] = useState(false);
  const { isLoggedIn, current } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderSmall(true);
        setIsInfoHidden(true);
      } else {
        setIsHeaderSmall(false);
        setIsInfoHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('current user:', current);
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) {
        dispatch(getCurrentUser());
      }
    }, 300);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn]);

  return (
    <div className={`fixed z-20 w-screen transition-all duration-300 ${isHeaderSmall ? 'h-[50px]' : 'h-[85px]'} flex flex-col bg-gradient-to-r from-[#3B5442] via-[#54795f] to-[#5d7d66]`}>
      <div className="flex justify-center h-full py-[10px] ">
        <div className="w-[240px] flex items-center justify-center object-cover">
          <Link to={`/${path.HOME}`} className="flex gap-2 items-center px-4 border-main">
            <span className="art-word-shadow-logo">Vieen's </span>
            <span className="art-word-shadow-logo">Store</span>
          </Link>
        </div>
        <div className="flex text-[13px] text-[#f0f4f1] px-6 }">
          <div className={`flex flex-col px-6 items-center justify-center transition-all duration-500 ${isInfoHidden ? 'hidden' : 'flex'}`}>
            <span className="flex gap-4 items-center">
              <FaShippingFast color="#f0f4f1" size={16} />
              <span className="font-semibold">Fast Delivery</span>
            </span>
            <span>Within 3 To 5 Days</span>
          </div>

          <div className={`flex flex-col px-6 items-center justify-center transition-all duration-500 ${isInfoHidden ? 'hidden' : 'flex'}`}>
            <span className="flex gap-4 items-center">
              <FaMoneyCheck color="#f0f4f1" size={16} />
              <span className="font-semibold">Payment</span>
            </span>
            <span>Secure And Safe</span>
          </div>

          <div className={`flex flex-col px-6  items-center justify-center transition-all duration-500 ${isInfoHidden ? 'hidden' : 'flex'}`}>
            <span className="flex gap-4 items-center">
              <MdCurrencyExchange color="#f0f4f1" size={16} />
              <span className="font-semibold">100% Free Returns</span>
            </span>
            <span>Within 30 Days Of Purchase</span>
          </div>

          {isLoggedIn && current ? (
            <Fragment>
              <div className={`flex rounded-[15px] ${isHeaderSmall ? 'bg-none opacity-none' : 'bg-main'}`}>
              <div onClick={() =>dispatch(showCart())} className="flex items-center justify-center px-5 p-2 gap-2 cursor-pointer">
                <HiShoppingBag size={24} color="#f0f4f1" />
                <span>{`${current?.cart?.length || 0} item`}</span>
              </div>

              <div
                className="flex cursor-pointer items-center gap-2 justify-center px-4 relative"
                onClick={() => setShowOption((prev) => !prev)}
                id="personal"
              >
                {current.avatar ? (
                  <img
                    src={current.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <img
                    src={avatar}
                    alt="Default Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{`${current?.lastname || ""} ${current?.firstname || ""}`}</span>
                {showOption && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute mt-2 flex flex-col top-full left-[22px] text-[#3a3a3a] bg-white min-w-[150px] border rounded-lg py-2 px-2 z-10"
                  >
                    <Link
                      className="w-full p-2 hover:text-main"
                      to={`/${path.MEMBER}/${path.PERSONAL}`}
                    >
                      Personal
                    </Link>

                    <Link
                      className="w-full p-2 hover:text-main"
                      to={`/${path.MEMBER}/${path.HISTORY}`}
                    >
                      My Ordered
                    </Link>

                    <Link
                      className="w-full p-2 hover:text-main"
                      to={`/${path.MEMBER}/${path.WISHLIST}`}
                    >
                      My Wishlist
                    </Link>

                    <Link
                      className="w-full p-2 hover:text-main"
                      to={`/${path.MEMBER}/${path.M_BLOG_LIST}`}
                    >
                      My Blog Post
                    </Link>

                    {+current.role === 99 && (
                      <Link
                        className="w-full p-2 hover:text-main"
                        to={`/${path.ADMIN}/${path.DASHBOARD}`}
                      >
                        Admin Workspace
                      </Link>
                    )}

                    
                   
                  </div>
                )}
                <div className="flex px-2">
                  <button
                    onClick={() => dispatch(logout())}
                    className="flex gap-2 items-center hover:text-[#dc764a] cursor-pointer px-2 bg-transparent border-none focus:outline-none"
                  >
                    <RiLogoutCircleRLine size={20} />
                    Log out
                  </button>
                </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="flex items-center justify-center px-6 bg-main rounded-[15px] gap-2">
              <Link className="hover:text-[#dcb04a]" to={`/${path.LOGIN}`}>
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Navigation />
      </div>
    </div>
  );
};

export default Header;
