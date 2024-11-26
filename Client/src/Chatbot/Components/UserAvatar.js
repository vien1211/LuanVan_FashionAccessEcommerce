import React from 'react';
import { useSelector } from 'react-redux'; 
import avtDefault from'../../assets/avtDefault.avif'

const UserAvatar = () => {
  const user = useSelector((state) => state.user?.current);

  return (
    <div className="w-[40px] h-[40px]">
      {user && user.avatar ? (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <img
          src={avtDefault} 
          alt="Default Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      )}
    </div>
  );
};

export default UserAvatar;
