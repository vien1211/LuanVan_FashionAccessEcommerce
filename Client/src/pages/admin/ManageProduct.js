import React, { useState, useEffect, useCallback } from "react";
import { InputField, Pagination, InputSelect, CustomVariant } from "../../components";
import { useForm } from "react-hook-form";
import { apiGetProducts, apiDeleteProduct } from "../../apis/product";
import moment from "moment";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { sorts } from "../../ultils/contants";
import icons from "../../ultils/icons";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";

const { HiFilter } = icons;

const ManageProduct = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const [sort, setSort] = useState("");
  const [showSortOptions, setShowSortOptions] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [customVariant, setCustomVariant] = useState(null)
  const [previewImage, setPreviewImage] = useState(null);

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const filteredTitleSorts = sorts.filter((sort) => {
    return sort.text.includes("Alphabet");
  });

  const filteredPriceSorts = sorts.filter((sort) => {
    return sort.text.includes("Price");
  });

  const categorySorts = [
    { id: 1, value: "category", text: "Category A-Z" },
    { id: 2, value: "-category", text: "Category Z-A" },
  ];
  const brandSorts = [
    { id: 1, value: "brand", text: "Brand A-Z" },
    { id: 2, value: "-brand", text: "Brand Z-A" },
  ];

  const quantitySorts = [
    { id: 1, value: "quantity", text: "Quantity Low-High" },
    { id: 2, value: "-quantity", text: "Quantity High-Low" },
  ];

  const soldSorts = [
    { id: 1, value: "sold", text: "Sold Low-High" },
    { id: 2, value: "-sold", text: "Sold High-Low" },
  ];

  const ratingSorts = [
    { id: 1, value: "totalRatings", text: "Rating Low-High" },
    { id: 2, value: "-totalRatings", text: "Rating High-Low" },
  ];

  const fetchProducts = async (params) => {
    const response = await apiGetProducts({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setProducts(response.productData);
    }
  };

  const queryDebounce = useDebounce(q, 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queryDebounce) {
      searchParams.q = queryDebounce;
    } else {
      delete searchParams.q;
    }
    fetchProducts(searchParams);
  }, [params, queryDebounce, update]);

  useEffect(() => {
    if (sort) {
      navigate({
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [sort, navigate]);

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  const changeValue = useCallback((value) => {
    setSort(value);
  }, []);

  const toggleSortOptions = (column) => {
    setShowSortOptions((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const changeSort = (value) => {
    setSort(value);
    setShowSortOptions({}); // Close dropdown after selecting
  };

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Remove this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteProduct(pid);
          if (response.success) {
            render();
            Swal.fire({
              title: "Deleted!",
              text: response.mes || "Product has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.mes || "Failed to delete product.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting this product.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  }

  return (
    <div className="w-full p-4 my-4 relative">
      {editProduct && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <UpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct} />
        </div>
      )}
      {customVariant && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <CustomVariant customVariant={customVariant} render={render} setCustomVariant={setCustomVariant} />
        </div>
      )}

      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Product</h1>
      </div>

      <div className="py-2 w-full overflow-x-auto">
        <div className="flex items-center justify-end py-2 px-2 gap-4">
          <InputField
            nameKey={"Search..."}
            value={q}
            setValue={setValue}
            style={"w-[350px] shadow-md"}
          />
          {/* <InputSelect
              changeValue={changeValue}
              value={sort}
              options={filteredSorts}
            /> */}
        </div>

        <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
          <thead className="font-bold bg-[#273526]  text-white text-[13px]">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Image</th>
              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2 ">
                  Title <HiFilter onClick={() => toggleSortOptions("title")} />
                </div>
                {showSortOptions.title && (
                  <div className="absolute w-[150px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {filteredTitleSorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2 ">
                  Category{" "}
                  <HiFilter onClick={() => toggleSortOptions("category")} />
                </div>
                {showSortOptions.category && (
                  <div className="absolute w-[110px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {categorySorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>
              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2 ">
                  Brand <HiFilter onClick={() => toggleSortOptions("brand")} />
                </div>
                {showSortOptions.brand && (
                  <div className="absolute w-[90px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {brandSorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2">
                  Price <HiFilter onClick={() => toggleSortOptions("price")} />
                </div>
                {showSortOptions.price && (
                  <div className="absolute w-[135px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {filteredPriceSorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2">
                  Quantity{" "}
                  <HiFilter onClick={() => toggleSortOptions("quantity")} />
                </div>
                {showSortOptions.quantity && (
                  <div className="absolute w-[145px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {quantitySorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2">
                  Sold <HiFilter onClick={() => toggleSortOptions("sold")} />
                </div>
                {showSortOptions.sold && (
                  <div className="absolute w-[115px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {soldSorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2">
                <div className="flex items-center gap-2">
                  Color <HiFilter />
                </div>
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2">
                  Rating{" "}
                  <HiFilter onClick={() => toggleSortOptions("totalRatings")} />
                </div>
                {showSortOptions.totalRatings && (
                  <div className="absolute w-[135px] bg-white text-main border border-gray-300 mt-3 rounded shadow-lg">
                    {ratingSorts.map((option) => (
                      <div
                        key={option.id}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => changeSort(option.value)}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </th>

              <th className="px-2 py-2">
                <div className="flex items-center gap-2">
                  Variant
                </div>
              </th>
             
           
         

              {/* <th className="px-2 py-2">Ratings</th> */}
              <th className="px-2 py-2">
                <div className="flex items-center gap-2">
                  UpdatedAt <HiFilter />
                </div>
              </th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((el, index) => (
              <tr
                key={el._id}
                className={` border-y-main text-[13px] ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                }`}
              >
                <td className="px-2 py-2">
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    index +
                    1}
                </td>
                <td className="py-2 px-2">
                   
                <img
                        src={el.images[0]}
                        alt={el.title}
                        className="w-[80px] h-[80px] object-contain"
                      />
                      
                    
                  </td>
                <td className="px-2 py-2">{el.title}</td>
                <td className="px-2 py-2">{el.category}</td>
                <td className="px-2 py-2">{el.brand}</td>
                <td className="px-2 py-2">{el.price}</td>
                <td className="px-2 py-2">{el.quantity}</td>
                <td className="px-2 py-2">{el.sold}</td>
                <td className="px-2 py-2">{el.color}</td>
                <td className="px-2 py-2">{el.totalRatings}</td>
                <td className="px-2 py-2">{el?.variant?.length || 0}</td>
                <td className="px-2 py-2">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="py-8 px-1 flex gap-2">
                  <span
                    onClick={() => setEditProduct(el)}
                    className="px-3 py-2 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076] transition duration-150"
                  >
                    Edit
                  </span>
                  <span 
                  onClick={() => handleDeleteProduct(el._id)}
                  className="px-3 py-2 text-white cursor-pointer bg-red-600 rounded-[5px] hover:bg-red-700 transition duration-150">
                    Delete
                  </span>

                  <span 
                  onClick={() => setCustomVariant(el)}
                  className="px-3 py-2 text-white cursor-pointer bg-[#8171cf] rounded-[5px] hover:bg-red-700 transition duration-150">
                    Variant
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex w-full px-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
