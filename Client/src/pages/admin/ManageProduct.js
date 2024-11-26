import React, { useState, useEffect, useCallback } from "react";
import {
  InputField,
  Pagination,
  InputSelect,
  CustomVariant,
  InputForm,
} from "../../components";
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
import UpdateVariant from "./UpdateVariant";
import { formatMoney } from "../../ultils/helper";

const { IoFilterOutline, CiEdit, CiEraser, CiMedicalClipboard } = icons;

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
  const [customVariant, setCustomVariant] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const render = useCallback(() => {
    setUpdate(!update);
  });
  const [expandedRow, setExpandedRow] = useState(null); // Track which product's variants to show
  const [editingVariant, setEditingVariant] = useState(null);

  const handleVariantToggle = (productId) => {
    // Toggle the visibility of the variants for the clicked product
    setExpandedRow(expandedRow === productId ? null : productId);
  };

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
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
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
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
              },
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.mes || "Failed to delete product.",
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
              },
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting this product.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              title: "custom-title",
              text: "custom-text",
              confirmButton: "custom-confirm-button",
              cancelButton: "custom-cancel-button",
            },
          });
        }
      }
    });
  };

  const handleSaveVariant = (variantId) => {
    // Thực hiện cập nhật variant ở đây (có thể gọi API hoặc cập nhật local state)
    console.log(
      "Updating variant with ID:",
      variantId,
      "New values:",
      editingVariant
    );
    setEditingVariant(null); // Đóng form sau khi lưu
  };

  return (
    <div className="w-full p-4 my-4 relative">
      {editProduct && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
          />
        </div>
      )}
      {customVariant && (
        <div className="absolute z-20 inset-0 min-h-screen bg-[#F5F5FA] ">
          <CustomVariant
            customVariant={customVariant}
            render={render}
            setCustomVariant={setCustomVariant}
          />
        </div>
      )}
      {editingVariant && (
        <div className="absolute z-10 inset-0 min-h-screen bg-[#F5F5FA] ">
          <UpdateVariant
            editingVariant={editingVariant}
            render={render}
            setEditingVariant={setEditingVariant}
            // fetchUpdatedVariants={fetchUpdatedVariants}
          />
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
                  Title <IoFilterOutline onClick={() => toggleSortOptions("title")} />
                </div>
                {showSortOptions.title && (
                  <div className="absolute w-[150px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  <IoFilterOutline onClick={() => toggleSortOptions("category")} />
                </div>
                {showSortOptions.category && (
                  <div className="absolute w-[110px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  Brand <IoFilterOutline onClick={() => toggleSortOptions("brand")} />
                </div>
                {showSortOptions.brand && (
                  <div className="absolute w-[90px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  Price <IoFilterOutline onClick={() => toggleSortOptions("price")} />
                </div>
                {showSortOptions.price && (
                  <div className="absolute w-[135px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  <IoFilterOutline onClick={() => toggleSortOptions("quantity")} />
                </div>
                {showSortOptions.quantity && (
                  <div className="absolute w-[145px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  Sold <IoFilterOutline onClick={() => toggleSortOptions("sold")} />
                </div>
                {showSortOptions.sold && (
                  <div className="absolute w-[115px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                  Color 
                </div>
              </th>

              <th className="px-2 py-2 relative">
                <div className="flex items-center gap-2">
                  Rating{" "}
                  <IoFilterOutline onClick={() => toggleSortOptions("totalRatings")} />
                </div>
                {showSortOptions.totalRatings && (
                  <div className="absolute w-[135px] bg-white text-main border font-light border-gray-300 mt-3 rounded shadow-lg">
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
                <div className="flex items-center gap-2">Variant</div>
              </th>

              {/* <th className="px-2 py-2">Ratings</th> */}
              {/* <th className="px-2 py-2">
                <div className="flex items-center gap-2">
                  UpdatedAt 
                </div>
              </th> */}
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((el, index) => (
              <React.Fragment key={el._id}>
                <tr
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
                  <td className="py-2">
                    <img
                      src={el.images[0]}
                      alt={el.title}
                      className="w-[60px] h-[60px] object-cover border rounded-lg"
                    />
                  </td>
                  <td className="px-2 py-2">{el.title}</td>
                  <td className="px-2 py-2">{el.category}</td>
                  <td className="px-2 py-2">{el.brand}</td>
                  <td className="px-2 py-2">{`${formatMoney(el.price)} VNĐ`}</td>
                  <td className="px-2 py-2">
                    {el.stockInfo?.[el.color]?.quantity || 0}
                  </td>
                  <td className="px-2 py-2">{el.sold}</td>
                  <td className="px-2 py-2">{el.color}</td>
                  <td className="px-2 py-2">{el.totalRatings}</td>
                  <td
                    className="px-2 py-2 cursor-pointer hover:text-[24px]"
                    onClick={() => handleVariantToggle(el._id)}
                  >
                    {el?.variant?.length || 0}
                  </td>
                  {/* <td className="px-2 py-2">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td> */}
                  <td className="py-8 px-1 flex gap-2">
                    <span
                      onClick={() => setEditProduct(el)}
                      className="px-2 py-2 text-white cursor-pointer bg-[#798b7d] rounded-full hover:bg-[#79a076] transition duration-150"
                    >
                      <CiEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteProduct(el._id)}
                      className="px-2 py-2 text-white cursor-pointer bg-red-600 rounded-full hover:bg-red-700 transition duration-150"
                    >
                      <CiEraser size={20} />
                    </span>

                    <span
                      onClick={() => setCustomVariant(el)}
                      // onClick={() => handleVariantToggle(el._id)}
                      className="px-2 py-2 text-white cursor-pointer bg-[#8171cf] rounded-full hover:bg-[#7d66f0] transition duration-150"
                    >
                      <CiMedicalClipboard size={20} />
                    </span>
                  </td>
                </tr>
                {expandedRow === el._id && (
                  <tr className="">
                    <td colSpan={12} className="py-4 px-6">
                      <div>
                        <h4 className="font-bold">"{el.title}" Variants:</h4>
                        <table className="w-full table-auto border-collapse my-4 text-[13px]">
                          <thead className="bg-[#bcc4bb]">
                            <tr>
                              <th className="border p-2">Images</th>
                              <th className="border p-2">Title</th>
                              <th className="border p-2">Color</th>
                              <th className="border p-2">Price</th>
                              <th className="border p-2">Quantity</th>
                             
                              <th className="border p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {el.variant.map((variant) => {
                              const stockQuantity =
                                el.stockInfo[variant.color]?.quantity || 0;

                              return (
                                <tr key={variant._id}>
                                  <td className=" border py-2 px-2">
                                    <img
                                      src={variant.images[0]}
                                      alt={variant.title}
                                      className="w-[60px] h-[60px] object-cover rounded-lg"
                                    />
                                  </td>
                                  <td className="border p-2">
                                    {variant.title}
                                  </td>
                                  <td className="border p-2">
                                    {variant.color}
                                  </td>
                                  <td className="border p-2">
                                  {`${formatMoney(variant.price)} VNĐ`}
                                    
                                  </td>
                                  <td className="border p-2">
                                    {stockQuantity}
                                  </td>
                                  
                                  <td className="border p-2">
                                    <button
                                      className="px-2 py-2 bg-main text-white rounded-full"
                                      onClick={() => setEditingVariant(variant)}
                                    >
                                      <CiEdit size={20} />
                                    </button>
                                    
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
                
              </React.Fragment>
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
