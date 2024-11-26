import React, { useCallback, useEffect, useState } from "react";
import {
  apiDeleteCoupon,
  apiGetCoupon,
  apiCreateCoupon,
  apiUpdateCoupon,
} from "../../apis";
import Swal from "sweetalert2";
import moment from "moment";
import icons from "../../ultils/icons";
import { BsPatchPlus } from "react-icons/bs";
const { CiEdit, CiEraser } = icons;

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    discount: 0,
    expire: "",
    usageLimit: 0,
  });
  const [update, setUpdate] = useState(false);

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await apiGetCoupon();
        if (response.success) {
          setCoupons(response.AllCoupon);
        } else {
          console.error("Failed to fetch coupons");
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load coupons.",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    };
    fetchCoupons();
  }, [update]);

  const handleDeleteCoupon = async (cid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this coupon discount?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button", // Optionally add for the cancel button
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteCoupon(cid);
          if (response.success) {
            render();
            Swal.fire({
              title: "Deleted!",
              text: "Coupon Discount has been deleted.",
              icon: "success",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
              },
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete coupon discount.",
              icon: "error",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
              },
            });
          }
        } catch (error) {
          console.error("An error occurred:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the coupon discount.",
            icon: "error",
            customClass: {
              title: "custom-title",
              text: "custom-text",
              confirmButton: "custom-confirm-button",
            },
          });
        }
      }
    });
  };

  const openModal = (coupon = null) => {
    setCurrentCoupon(coupon); // Set current coupon if editing
    setFormValues({
      name: coupon ? coupon.name : "",
      discount: coupon ? coupon.discount : 0,
      expire: coupon ? moment(coupon.expire).format("YYYY-MM-DD") : "",
      usageLimit: coupon ? coupon.usageLimit : 0,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentCoupon(null);
    setFormValues({ name: "", discount: 0, expire: "", usageLimit: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating coupon:", currentCoupon);

      const response = currentCoupon
        ? await apiUpdateCoupon(formValues, currentCoupon._id)
        : await apiCreateCoupon(formValues);

      if (response.success) {
        render();
        closeModal();
        Swal.fire({
          title: "Success!",
          text: currentCoupon
            ? "Coupon updated successfully"
            : "Coupon created successfully",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to save coupon",
          icon: "error",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving the coupon.",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Coupon Discount</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#7b2164] hover:bg-[#ac669a] flex items-center gap-2 text-white text-[16px] px-4 py-1 rounded-[12px]"
        >
          <BsPatchPlus size={24} />
          Create Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div className="my-4 px-6 py-3">
        <span className="block text-[16px] font-semibold text-white bg-main w-fit px-3 py-1 mb-3 rounded-full">
          Active Coupons
        </span>
        {coupons.filter((coupon) => new Date(coupon.expire) > new Date()).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons
              .filter((coupon) => new Date(coupon.expire) > new Date())
              .map((coupon) => (
                <div
                  key={coupon.id}
                  className="p-4 bg-[#e8f3ec] rounded-[15px] shadow-md hover:bg-[#d0e7da] transition-colors duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg text-gray-800">
                      {coupon.name}
                    </span>
                    <span className="text-main text-lg font-bold">
                      {coupon.discount}% off
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex flex-col">
                      <div>
                        Created At{" "}
                        <span className="font-medium">
                          {moment(coupon.createdAt).format("DD [Th] MM, YYYY")}
                        </span>
                      </div>
                      <div className="my-2">
                        Valid until{" "}
                        <span className="font-medium">
                          {moment(coupon.expire).format("DD [Th] MM, YYYY")}
                        </span>
                      </div>
                      <div className="my-2">
                        Used:{" "}
                        <span className="font-medium">
                          {coupon.usedBy.length || 0} / {coupon.usageLimit}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        onClick={() => openModal(coupon)}
                        className="flex items-center px-2 py-2 bg-main text-white rounded-full cursor-pointer hover:bg-[#79a076] transition"
                      >
                        <CiEdit size={20} />
                      </span>
                      <span
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="flex items-center px-2 py-2 bg-red-600 text-white rounded-full cursor-pointer hover:bg-[#b25555] transition"
                      >
                        <CiEraser size={20} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            No available coupons
            </div>
        )}
      </div>

      <div className=" px-6">
        <span className="block text-[16px] font-semibold text-white bg-[#a64b4b] w-fit px-3 py-1 mb-3 rounded-full">
          Expired Coupons
        </span>
        {/* Lọc coupon hết hạn */}
        {coupons.filter((coupon) => new Date(coupon.expire) < new Date())
          .length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons
              .filter((coupon) => new Date(coupon.expire) < new Date())
              .map((coupon) => (
                <div
                  key={coupon.id}
                  className="p-4 mb-3 bg-[#f9f0f0] rounded-[15px] shadow-md hover:bg-[#f2e2e2] transition-colors duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg text-gray-800">
                      {coupon.name}
                    </span>
                    <span className="text-main text-lg font-bold">
                      {coupon.discount}% off
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex flex-col">
                      <div>
                        Created At{" "}
                        <span className="font-medium">
                          {moment(coupon.createdAt).format("DD [Th] MM, YYYY")}
                        </span>
                      </div>
                      <div className="my-2">
                        Valid until{" "}
                        <span className="font-medium">
                          {moment(coupon.expire).format("DD [Th] MM, YYYY")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      
                      <span
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="flex items-center px-2 py-2 bg-red-600 text-white rounded-full cursor-pointer hover:bg-[#b25555] transition"
                      >
                        <CiEraser size={20} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">No available expire coupons</div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[90%] md:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              {currentCoupon ? "Edit Coupon" : "Create Coupon"}
            </h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Coupon Name</label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formValues.discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formValues.usageLimit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expire"
                  value={formValues.expire}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-main text-white rounded hover:bg-main-dark"
                >
                  {currentCoupon ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
