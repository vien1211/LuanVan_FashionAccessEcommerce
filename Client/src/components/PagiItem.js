import React, { useEffect } from "react";
import clsx from "clsx";
import {
  useSearchParams,
  useNavigate,
  
  createSearchParams,
  useLocation
} from "react-router-dom";

// const PagiItem = ({ children }) => {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const location = useLocation()
 
//   const handlePagination = () => {
//     const queries = Object.fromEntries([...params])
//     if (Number(children)) queries.page = children;
//     navigate({
//       pathname: location.pathname,
//       search: createSearchParams(queries).toString(),
//     });
//   };
//   return (
//     <button
//       className={clsx(
//         "w-10 h-10 flex justify-center rounded-full",
//         !Number(children) && "items-end p-2",
//         Number(children) && "items-center hover:rounded-full hover:bg-main hover:text-white",
//         +params.get("page") === +children && "rounded-full bg-main text-white",
//         !+params.get("page") && +children === 1 && "rounded-full bg-main text-white"
//       )}
//       type="button"
//       disabled={!Number(children)}
//       onClick={handlePagination}
//     >
//       {children}
//     </button>
//   );
// };

// export default PagiItem;

const PagiItem = ({ children }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePagination = () => {
    const queries = Object.fromEntries([...params]);
    queries.page = children;
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    });
  };

  return (
    <button
      className={clsx(
        "w-10 h-10 flex justify-center rounded-full",
        "items-center hover:rounded-full hover:bg-main hover:text-white",
        +params.get("page") === +children && "rounded-full bg-main text-white"
      )}
      type="button"
      onClick={handlePagination}
    >
      {children}
    </button>
  );
};

export default PagiItem;
