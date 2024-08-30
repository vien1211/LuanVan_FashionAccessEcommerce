import React, { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { getCurrentUser } from "../store/user/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "../ultils/icons";
import { logout } from "../store/user/userSlice";

const { RiLogoutCircleRLine } = icons;

const TopHeader = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);
 
  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
  console.log('current user:', current);
  const setTimeoutId = setTimeout(() => {
    if (isLoggedIn) {
      dispatch(getCurrentUser());
    }
  }, 300);
    return() => {
      clearTimeout(setTimeoutId)
    }
    
  }, [dispatch, isLoggedIn]);

  // if (isLoading) {
  //   return <div className="h-[38px] w-full bg-main flex items-center justify-center text-white">Loading...</div>;
  // }

  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      {/* <div className="w-main flex items-center justify-between text-xs text-white">
        <span>CALL US (+1800) 000 8808</span>
        {isLoggedIn && current ? (
          <div className="flex gap-4 text-md items-center">
            <span>{`Welcome! ${current.lastname || ''} ${current.firstname || ''}`}</span>
            <button
              onClick={() => dispatch(logout())}
              className="border-l flex gap-2 items-center hover:text-[#dcb04a] cursor-pointer px-2 bg-transparent border-none text-white focus:outline-none"
            >
              <RiLogoutCircleRLine size={20} /> Log out
            </button>
          </div>
        ) : (
          <Link className="hover:text-[#dcb04a]" to={`/${path.LOGIN}`}>
            Sign In Now
          </Link>
        )}
      </div> */}
    </div>
  );
};

export default memo(TopHeader);
