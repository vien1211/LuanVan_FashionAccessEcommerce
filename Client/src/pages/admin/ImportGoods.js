import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { showModal } from "../../store/app/appSlice";
import { Button, InputForm, Loading, Select } from "../../components";
import { apiCreateGoodsReceipt } from "../../apis";
import { fetchSuppliers } from "../../store/supplier/AsyncAction";
import { getAllProducts } from "../../store/products/AsyncActions";
import { formatMoney } from "../../ultils/helper";
import * as XLSX from "xlsx";
import moment from "moment";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

const ImportGoods = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.supplier);
  const { products } = useSelector((state) => state.product);

  const [productsInReceipt, setProductsInReceipt] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleImportGoods = async (data) => {
    const { supplier } = data;

    if (!supplier || productsInReceipt.length === 0) {
      Swal.fire({
        title: "Oops!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }

    const receiptData = {
      supplier,
      products: productsInReceipt,
      totalAmount,
    };

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiCreateGoodsReceipt(receiptData);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));

    if (response.success) {
      Swal.fire({
        title: "Created",
        text: "Import goods successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      reset({ supplier: "", product: "", color: "", price: "", quantity: "" });
      setProductsInReceipt([]);
      setTotalAmount(0);
    } else {
      Swal.fire({
        title: "Oops!",
        text: response.message || "Failed to import goods!",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  const addProductToReceipt = (product) => {
    setProductsInReceipt((prevProducts) => {
      const existingProduct = prevProducts.find(
        (item) =>
          item.product === product.product && item.color === product.color
      );
      if (existingProduct) {
        return prevProducts.map((item) =>
          item.product === product.product && item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...prevProducts, product];
      }
    });

    const newTotalAmount = totalAmount + product.price * product.quantity;
    setTotalAmount(newTotalAmount);
  };

  const handleAddProduct = () => {
    const selectedProductId = watch("product");
    const selectedProduct = products.find((p) => p._id === selectedProductId);

    if (!selectedProduct) {
      Swal.fire({
        title: "Oops!",
        text: "Please select a valid product.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }

    const availableColors = selectedProduct.color || [];
    const variantColors =
      selectedProduct.variant?.map((variant) => variant.color) || [];
    const allColors = [...new Set([...availableColors, ...variantColors])];

    const productData = {
      product: selectedProductId,
      supplier: watch("supplier"),
      color: watch("color"),
      price: Number(watch("price")),
      quantity: Number(watch("quantity")),
    };

    if (
      !productData.product ||
      !productData.color ||
      !productData.price ||
      !productData.quantity
    ) {
      Swal.fire({
        title: "Oops!",
        text: "Please fill in all product fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    addProductToReceipt(productData);
  };

  const handleExportToExcel = () => {
    const creationDate = moment(productsInReceipt[0]?.createdAt).format("DD-MM-YYYY");
    const worksheet = XLSX.utils.json_to_sheet(
      productsInReceipt.map((item) => {
        const product = products.find((p) => p._id === item.product);
        return {
          "Product Name": product ? product.title : "Unknown Product",
          Color: item.color,
          Quantity: item.quantity,
          Price: formatMoney(item.price) + " VNĐ",
          Total: formatMoney(item.price * item.quantity) + " VNĐ",
          "Date Of Entry": moment(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Goods Receipt");
    XLSX.writeFile(workbook, `Goods_Receipt_${creationDate}.xlsx`);
  };

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div className="w-full p-6 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Import Goods</h1>
        <button
            onClick={handleExportToExcel}
            className="flex ml-auto gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
          >
            <HiOutlineArrowDownTray size={20} className=""/>
            Export Excel
          </button>
      </div>

      <div className="py-4">
        <form onSubmit={handleSubmit(handleImportGoods)}>
          <Select
            label="Supplier"
            option={suppliers?.map((el) => ({
              code: el._id,
              value: el.name,
            }))}
            register={register}
            id="supplier"
            style="flex-auto rounded-md"
            errors={errors}
            validate={{
              required: "Require",
            }}
            fullWidth={true}
          />

          <div className="w-full my-4 flex gap-4">
            <Select
              label="Product"
              option={products?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="product"
              style="flex-auto rounded-md"
              errors={errors}
              validate={{
                required: "Require",
              }}
              fullWidth={true}
            />

            <Select
              label="Color"
              option={
                watch("product")
                  ? [
                      ...new Set([
                        products.find((p) => p._id === watch("product"))
                          ?.color || [],
                        ...(products
                          .find((p) => p._id === watch("product"))
                          ?.variant?.map((v) => v.color) || []),
                      ]),
                    ].map((color) => ({ code: color, value: color }))
                  : []
              }
              register={register}
              id="color"
              style="flex-auto rounded-md"
              errors={errors}
              validate={{
                required: "Require",
              }}
              fullWidth={true}
            />
          </div>

          <div className="w-full my-4 flex gap-4">
            <InputForm
              label="Import Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Require",
              }}
              fullWidth
              placeholder="Quantity"
              style="rounded-md py-2 flex-auto"
            />

            <InputForm
              label="Import Unit Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Require",
              }}
              fullWidth
              placeholder="Price"
              style="rounded-md py-2 flex-auto"
            />
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            className="mt-4 px-4 py-2  bg-[#F68D4B] text-white rounded"
          >
            Add To Receipt
          </button>

          <div className="product-list">
            <div className="flex px-2 py-4 bg-[#F5F5FA] items-center text-lg font-bold">
              <h2>Selected Products</h2>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#FFFCEF] text-left">
                  <th className="border border-gray-300 px-4 py-2 font-semibold">
                    Product Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">
                    Color
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {productsInReceipt.map((item, index) => {
                  const product = products.find((p) => p._id === item.product);

                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {product ? product.title : "Unknown Product"}
                      </td>

                      <td className="border border-gray-300 px-4 py-2">
                        {item.color}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {`${formatMoney(item.price)} VNĐ`}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {`${formatMoney(item.price * item.quantity)} VNĐ`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <span className="px-2 py-4 text-lg font-bold">Total Amount: </span>
            <span className="ml-2">{`${formatMoney(totalAmount)} VNĐ`}</span>
          </div>

          <Button name="Import Goods" type="submit"></Button>
          
        </form>
      </div>
    </div>
  );
};

export default ImportGoods;
