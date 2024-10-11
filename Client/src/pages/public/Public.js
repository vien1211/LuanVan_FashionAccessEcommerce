// import React from 'react'
// import {Outlet} from 'react-router-dom'
// import {
//     Header,
//     Navigation,
//     TopHeader,
//     Footer
// } from '../../components'

// const Public = () => {
//   return (
//     <div className='bg-gradient-to-r from-[#3B5442] via-[#54795f] to-[#5d7d66] flex flex-col items-center'>
//         {/* <TopHeader /> */}
//         <Header />
//         {/* <Navigation /> */}
//         <div className='w-main mt-[150px]'>
//             <Outlet />
//         </div>
//         <Footer />
//     </div>
//   )
// }

// export default Public

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from '../../components';

const Public = () => {
  const location = useLocation();

  // Apply background gradient only for the Home page
  const isHomePage = location.pathname === '/';

  return (
    <div
      className={`flex flex-col items-center ${
        isHomePage ? 'bg-gradient-to-r from-[#3B5442] via-[#54795f] to-[#5d7d66] h-screen overflow-y-hidden' : 'bg-white'
      }`}
    >
      <Header />
      <div className={`w-main ${isHomePage ? ' mt-[60px]' : 'mt-[120px]'}`}>
        <Outlet />
      </div>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default Public;
