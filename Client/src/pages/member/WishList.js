import React from 'react'
import { useSelector } from 'react-redux'
import { CardProduct } from '../../components'


const WishList = () => {
  const { current } = useSelector((state) => state.user);

  return (
    <div className="w-full relative p-4">
      <header className="text-3xl font-bold py-2 px-4">Wish List</header>
      <div className='p-3 w-full grid grid-cols-4 gap-4'>
        {current?.wishlist?.map(el => (
          <div key={el._id} className='w-[275px] h-full'>
            <CardProduct 
              pid={el._id}
              productData={el}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};


export default WishList

// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom'; 
// import { formatMoney } from '../../ultils/helper';
// import { apiUpdateWishlist } from '../../apis';
// import { getCurrentUser } from '../../store/user/asyncActions';
// import Swal from 'sweetalert2';
// import { Button } from '../../components';
// import { IoCloseCircle } from 'react-icons/io5';

// const WishList = () => {
//   const { current } = useSelector(s => s.user);
//   const dispatch = useDispatch();

//   const handleRemoveFromWishlist = async (pid) => {
//     const response = await apiUpdateWishlist(pid);
//     if (response.success) {
//       dispatch(getCurrentUser());
//       Swal.fire({
//         title: "Updated",
//         text: "This Product Has Been Deleted From Wish List!",
//         icon: "success"
//       });
//     } else {
//       Swal.fire({
//         title: "Oops!",
//         text: "Something Went Wrong!",
//         icon: "error"
//       });
//     }
//   };

//   return (
//     <div className="w-full relative p-4">
//       <header className="text-3xl font-bold py-4">Wish List</header>

//       <div className='p-4 w-full grid grid-cols-4 gap-4'>
//         {current?.wishlist?.map((el) => (
//           <div key={el._id} pid={el._id} productData={el} className="relative border bg-white rounded-[10px] p-4 shadow-sm">
            
//             <IoCloseCircle size={28}
//               className="absolute top-2 right-2 text-xl text-[#DA7474] cursor-pointer"
//               onClick={() => handleRemoveFromWishlist(el._id)}
//             />
//             <Link to={`/${el.category?.toLowerCase() || 'default-category'}/${el._id}/${el.title.toLowerCase()}`} className="block">
//               <img src={el.images[0]} alt={el.title} className="w-full h-[200px] object-cover rounded-[10px]" />
//               <h2 className="text-xl font-semibold mt-2 line-clamp-1">{el.title}</h2>
//               <p className="text-lg text-main font-light">{formatMoney(el.price)} VNĐ</p>
//               <Button name="See Detail" fw />
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WishList;






