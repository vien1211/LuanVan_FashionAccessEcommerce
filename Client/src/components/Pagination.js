// import React from "react";
// import usePagination from "../hooks/usePagination";
// import { PagiItem } from "./";
// import { useSearchParams } from "react-router-dom";

// const Pagination = ({ totalCount }) => {
//   const [params] = useSearchParams();
//   const pagination = usePagination(totalCount, +params.get("page") || 1);
//   const range = () => {
//     const currentPage = +params.get("page");
//     const pageSize = +process.env.REACT_APP_LIMIT || 10;
//     const start = (currentPage - 1) * pageSize + 1;
//     const end = Math.min(currentPage * pageSize, totalCount);

//     return `${start} - ${end}`;
//   };

//   return (
//     <div className="flex items-center justify-between w-full">
//       {!+params.get("page") ? (
//         <span>{`Show 1 - ${
//           Math.min(+process.env.REACT_APP_LIMIT, totalCount) || 10
//         } of ${totalCount}`}</span>
//       ) : (
//         ""
//       )}
//       {+params.get("page") ? (
//         <span>{`Show ${range()} of ${totalCount}`}</span>
//       ) : (
//         ""
//       )}
//       <div className="flex items-center">
//         {pagination?.map((el) => (
//           <PagiItem key={el}>{el}</PagiItem>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Pagination;

import React from "react";
import { useSearchParams } from "react-router-dom";
import PagiItem from "./PagiItem";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const currentPage = +params.get("page") || 1;
  const pageSize = +process.env.REACT_APP_LIMIT || 4; // Số lượng sản phẩm mỗi trang
  const totalPages = Math.ceil(totalCount / pageSize); // Tính tổng số trang
  const maxPagesToShow = 5; // Số trang tối đa hiển thị trước khi dùng dấu ba chấm

  const generatePaginationItems = () => {
    const pagiItems = [];

    // Trang đầu tiên luôn hiển thị
    pagiItems.push(
      <PagiItem key={1}>{1}</PagiItem>
    );

    if (totalPages <= maxPagesToShow) {
      // Hiển thị toàn bộ trang nếu số trang nhỏ hơn hoặc bằng maxPagesToShow
      for (let i = 2; i < totalPages; i++) {
        pagiItems.push(<PagiItem key={i}>{i}</PagiItem>);
      }
    } else {
      // Trường hợp có nhiều trang
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pagiItems.push(<span key="start-ellipsis">...</span>);
      }

      for (let i = startPage; i <= endPage; i++) {
        pagiItems.push(<PagiItem key={i}>{i}</PagiItem>);
      }

      if (endPage < totalPages - 1) {
        pagiItems.push(<span key="end-ellipsis">...</span>);
      }
    }

    // Trang cuối cùng luôn hiển thị
    if (totalPages > 1) {
      pagiItems.push(
        <PagiItem key={totalPages}>{totalPages}</PagiItem>
      );
    }

    return pagiItems;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <span>{`Show ${currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1} - ${
        Math.min(currentPage * pageSize, totalCount)
      } of ${totalCount}`}</span>
      
      <div className="flex items-center">
        {generatePaginationItems()}
      </div>
    </div>
  );
};

export default Pagination;
