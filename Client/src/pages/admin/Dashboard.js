import React, { useEffect, useState } from "react";
import {
  apiGetAllBlog,
  apiGetAllBrand,
  apiGetAllUser,
  apiGetCategories,
  apiGetOrderByAdmin,
  apiGetOrderToDay,
  apiGetProducts,
  apiGetReceipts,
  apiGetStock,
  apiGetSuppliers,
  apiGetUserToday,
} from "../../apis";
import { FaPlus } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdOutlinePriceChange } from "react-icons/md";
import { SlHandbag } from "react-icons/sl";
import { LuUserPlus } from "react-icons/lu";
import { Link, useSearchParams } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import avt from "../../assets/avtDefault.avif";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import path from "../../ultils/path";
import CountUp from "react-countup";
import moment from "moment";
import { formatMoney } from "../../ultils/helper";

// Register Chart.js components for pie chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState([]);
  const [blog, setBlog] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState(null);
  const [latestComments, setLatestComments] = useState(null);
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    users: 0,
    orders: 0,
    inventory: 0,
    blog: 0,
    supplier: 0,
    totalRevenueToday: 0,
    totalProductsSoldToday: 0,
  });

  const fetchProducts = async (params) => {
    const response = await apiGetProducts({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, products: response.counts }));
      setProducts(response.productData);
    }
  };

  const fetchTopSellingProducts = async () => {
    const response = await apiGetProducts();
    if (response.success) {
      const sortedProducts = response.productData
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);
      setTopSellingProducts(sortedProducts);
    }
  };

  const data = {
    labels: topSellingProducts?.map((product) => product.title),
    datasets: [
      {
        label: "Sold",
        data: topSellingProducts?.map((product) => product.sold),
        backgroundColor: "#6D8777",
        borderColor: "#617360",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 10 Best Selling Products",
        position: "bottom",
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },

      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const fetchCategories = async (params) => {
    const response = await apiGetCategories({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, categories: response.counts }));
      setCategories(response.proCate);
    }
  };

  const fetchBrands = async (params) => {
    const response = await apiGetAllBrand({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, brands: response.counts }));
      setBrands(response.allbrand);
    }
  };

  const fetchUsers = async (params) => {
    const response = await apiGetAllUser({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, users: response.counts }));
      setUsers(response.users);
    }
  };
  const [blogData, setBlogData] = useState({
    labels: [],
    datasets: [],
  });

  const [paymentData, setPaymentData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchOrders = async (params) => {
    const response = await apiGetOrderByAdmin();
    if (response.success) {
      setCounts((prev) => ({ ...prev, orders: response.counts }));
      setOrders(response.orders);
    }

    const paymentMethodCounts = response.orders.reduce((acc, order) => {
      const method = order.paymentMethod || "Unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    setPaymentData({
      labels: Object.keys(paymentMethodCounts),
      datasets: [
        {
          label: "Number of Orders",
          data: Object.values(paymentMethodCounts),
          backgroundColor: ["#e09d87", "#afb3ed"],
          borderWidth: 1,
        },
      ],
    });
  };

  const fetchInventory = async (params) => {
    const response = await apiGetStock({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({
        ...prev,
        totalQuantity: response.totalQuantity, // If you want to store total quantity
        inventory: response.counts, // If this is the actual inventory count
      }));
      setInventory(response.Stock);
    }
  };

  const fetchBlog = async (params) => {
    const response = await apiGetAllBlog({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, blog: response.counts }));
      setBlog(response.AllBlog);
    }

    const latestComments = response.AllBlog.flatMap((post) =>
      post.comment.map((comment) => ({ ...comment, postTitle: post.title }))
    )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setLatestComments(latestComments);

    const latestBlogs = response.AllBlog.slice(0, 5);
    const likes = latestBlogs.map((blog) => blog.likesCount);
    const dislikes = latestBlogs.map((blog) => blog.dislikesCount);
    const comment = latestBlogs.map((blog) => blog.comment.length);
    const numberView = latestBlogs.map((blog) => blog.numberView);

    setBlogData({
      labels: latestBlogs.map((blog) => blog.title), // Tên bài viết
      datasets: [
        {
          label: "Likes",
          data: likes,
          backgroundColor: "#f1cbce",
        },
        {
          label: "Dislikes",
          data: dislikes,
          backgroundColor: "#c4a8ef",
        },
        {
          label: "Comments",
          data: comment,
          backgroundColor: "#6080c6",
        },
        {
          label: "Views",
          data: numberView,
          backgroundColor: "#c67160",
        },
      ],
    });
  };

  const fetchOrdersToday = async () => {
    const response = await apiGetOrderToDay();
    if (response.success) {
      setCounts((prev) => ({
        ...prev,
        ordersToday: response.counts,
        totalRevenueToday: response.totalRevenue,
        totalProductsSoldToday: response.totalProductsSold,
      }));
    }
  };

  const fetchUsersToday = async () => {
    const response = await apiGetUserToday(); // Assuming the backend filters today's users
    if (response.success) {
      setCounts((prev) => ({ ...prev, usersToday: response.counts }));
      setUsers(response.users);
    }
  };

  const fetchSuppliers = async (params) => {
    const response = await apiGetSuppliers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts((prev) => ({ ...prev, supplier: response.counts }));
      setSupplier(response.suppliers);
    }
  };

  const fetchReceipt = async (params) => {
    const response = await apiGetReceipts({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setReceipt(response.receipts);
    }
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
    fetchCategories(searchParams);
    fetchBrands(searchParams);
    fetchUsers(searchParams);
    fetchOrders(searchParams);
    fetchInventory(searchParams);
    fetchOrdersToday(searchParams);
    fetchUsersToday(searchParams);
    fetchBlog(searchParams);
    fetchSuppliers(searchParams);
    fetchReceipt(searchParams);
    fetchTopSellingProducts(searchParams);
  }, [params]);

  const newestProducts = inventory
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const newestOrders = orders
  ?.filter(order => order.status === 'Awaiting Confirmation')
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrencyShort = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + "T";
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return value.toLocaleString();
    }
  };

  return (
    <div className="w-full p-6 my-2 bg-gray-50">
      {/* Page Title */}
      {/* <div className="flex px-6 justify-between items-center text-4xl font-extrabold mb-8">
    <h1>Dashboard</h1>
  </div> */}

      {/*1-Today's Sale */}
      <div className="bg-[#45624E] gap-6 p-5 px-8 rounded-xl mb-6">
        <div className="mb-4">
          <h1 className="text-[24px] font-semibold text-white">Today Sales</h1>
          <span className="text-[14px] font-light text-white">
            Sale Summary
          </span>
        </div>
        {/* Today's Orders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#273526] p-6 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
            <LiaClipboardListSolid size={32} className="text-[#86AFAC]" />
            <p className="py-2 text-2xl font-bold text-white">
              {counts.ordersToday}
            </p>
            <h2 className="text-lg font-semibold text-[#86AFAC]">
              Total Order
            </h2>
          </div>

          <div className="bg-[#273526] p-6 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
            <MdOutlinePriceChange size={32} className="text-[#AB7F45]" />
            <p className="py-2 text-2xl font-bold text-white">
              {counts.totalRevenueToday
                ? formatCurrencyShort(counts.totalRevenueToday)
                : "0"}{" "}
              VNĐ
            </p>
            <h2 className="text-lg font-semibold text-[#AB7F45]">
              Total Sales
            </h2>
          </div>

          {/* Products Sold Today */}
          <div className="bg-[#273526] p-6 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
            <SlHandbag size={32} className="text-[#A68AA6]" />
            <p className="py-2 text-2xl font-bold text-white">
              {counts.totalProductsSoldToday}
            </p>
            <h2 className="text-lg font-semibold text-[#A68AA6]">
              Products Sold
            </h2>
          </div>

          {/* New Users Today */}
          <div className="bg-[#273526] p-6 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
            <LuUserPlus size={32} className="text-[#1E9FDE]" />
            <p className="py-2 text-2xl font-bold text-white">
              {counts.usersToday}
            </p>
            <h2 className="text-lg font-semibold text-[#1E9FDE]">New Users</h2>
          </div>
        </div>
      </div>

      {/*2-Store Summary */}
      <div className="grid grid-cols-6 gap-3 bg-[#7d8b6fcb] p-6 rounded-2xl shadow-lg">
        <div className="col-span-6 text-center">
          <h1 className="text-[28px] uppercase font-semibold text-[#45624E]">
            Our Store Overview
          </h1>
          <span className="text-[14px] font-light text-slate-100">
            Store Summary
          </span>
        </div>

        <div className="grid grid-cols-6 gap-3 col-span-6">
          {/* Products Summary */}
          <Link to={`/${path.ADMIN}/${path.MANAGE_PRODUCT}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.products} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Products
              </h2>
            </div>
          </Link>

          {/* Categories Summary */}
          <Link to={`/${path.ADMIN}/${path.MANAGE_CATEGORY}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.categories} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Categories
              </h2>
            </div>
          </Link>

          {/* Brands Summary */}
          <Link to={`/${path.ADMIN}/${path.MANAGE_BRAND}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.brands} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Brands
              </h2>
            </div>
          </Link>

          {/* Users Summary */}
          <Link to={`/${path.ADMIN}/${path.MANAGE_USER}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.users} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Users
              </h2>
            </div>
          </Link>
          {/* Orders Summary */}
          <Link to={`/${path.ADMIN}/${path.MANAGE_ORDER}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.orders} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Orders
              </h2>
            </div>
          </Link>

          <Link to={`/${path.ADMIN}/${path.MANAGE_BLOG_POST}`}>
            <div
              className="flex flex-col items-center gap-2 justify-center p-6 text-main bg-white shadow-lg rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-b before:to-[#eef1ef] before:from-[#dbece1c9] 
                 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
                  hover:shadow-lg ease-in-out transform"
            >
              <p className="z-10 text-4xl font-bold text-main">
                <CountUp end={counts.blog} duration={2} />
              </p>
              <h2 className="z-10 text-lg font-semibold text-gray-600">
                Blog Post
              </h2>
            </div>
          </Link>
        </div>
      </div>

      {/*3-Inventory, Supplier, Add Receipt */}
      <div className="py-5 flex gap-6">
        {/* Inventory Section */}
        <div className="w-[60%] transition transform hover:scale-105 duaration-500 py-4">
          <Link to={`/${path.ADMIN}/${path.INVENTORY}`}>
            <div className="w-full flex flex-col items-center gap-2 justify-center p-5 text-main bg-[#ecf1e6cf] hover:bg-slate-100 shadow-md rounded-[20px]">
              <h2 className="text-3xl font-semibold text-gray-600">
                Inventory
              </h2>
              <p className="text-4xl font-bold text-main">
                {counts.totalQuantity}
              </p>

              {counts.inventory > 0 ? (
                <p className="text-base font-medium text-green-600">
                  Products in Stock
                </p>
              ) : (
                <p className="text-base font-medium text-red-600">
                  Out of Stock
                </p>
              )}

              {newestProducts?.length > 0 && (
                <div className="mt-2">
                  <table className="w-full table-auto mt-2">
                    <thead className="text-gray-500 text-[15px]">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">#</th>
                        <th className="px-4 py-2 border-b text-left">
                          Product Name
                        </th>
                        <th className="px-4 py-2 border-b text-left">Image</th>
                        <th className="px-4 py-2 border-b text-left">Color</th>
                        <th className="px-4 py-2 border-b text-left">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {newestProducts.map((product, index) => (
                        <tr
                          key={product._id}
                          className="font-light text-[13px]"
                        >
                          <td className="px-4 py-2 border-b">{index + 1}</td>
                          <td className="px-4 py-2 border-b">
                            {product.product?.title}
                          </td>
                          <td className="px-4 py-2 border-b">
                            <img
                              src={product.product.images[0]}
                              className="w-[50px] h-[50px] rounded-lg"
                            />
                          </td>

                          <td className="px-4 py-2 border-b">
                            {product.color}
                          </td>
                          <td className="px-4 py-2 border-b">
                            {product.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Supplier Section */}
        <div className="flex-1 py-8">
          <div className="w-full flex flex-col gap-4 py-3 px-5 bg-[#474d3e21] shadow shadow-lime-600 rounded-[20px] text-main">
            <h2 className="text-2xl mt-2 font-semibold text-gray-700">
              Supplier
            </h2>
            <p className="text-4xl font-bold text-main">
              <CountUp end={counts.supplier} duration={2} />
            </p>

            <div className="flex gap-4 mb-2">
              <Link to={`/${path.ADMIN}/${path.ADD_SUPPLIER}`}>
                <button className="px-4 py-2 bg-main text-white rounded-full hover:bg-[#065f46] transition duration-300">
                  Add Supplier
                </button>
              </Link>

              <Link to={`/${path.ADMIN}/${path.MANAGE_SUPPLIER}`}>
                <button className="px-4 py-2 bg-main text-white rounded-full hover:bg-[#065f46] transition duration-300">
                  Manage Supplier
                </button>
              </Link>
            </div>
          </div>

          {/* Add New Receipt Section */}
          <div className="w-full mt-5 p-3 bg-[#474d3e21] shadow shadow-lime-600 rounded-[20px] text-main">
            <Link to={`/${path.ADMIN}/${path.IMPORT_GOODS}`}>
              <div className="w-full py-4">
                <FaPlus size={82} className="mx-auto hover:text-[#324f1b]" />
              </div>
              <h2 className="text-lg my-2 text-center font-semibold text-gray-600">
                Add New Goods Receipt
              </h2>
            </Link>
          </div>
        </div>
      </div>


      {/*4-Top 10 Best Selling, Order By Method */}
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {/* Cột trái lớn hơn */}
        <div className="w-full md:w-2/3 p-6 my-2 bg-[#ffffff] rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Top 10 Best Selling Products
          </h2>
          <div className="w-full p-4">
            <Bar data={data} options={options} />
          </div>
        </div>

        {/* Cột phải nhỏ hơn */}
        <div className="w-full md:w-1/3 bg-white p-6 my-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-md font-semibold text-center mb-6 text-gray-600">
            Orders by Payment Method
          </h2>
          <div style={{ width: "280px", height: "280px", margin: "0 auto" }}>
            <Pie
              data={paymentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Orders By Payment Method",
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>


      {/*5-New Cmt Blog, 5 Newest Blog */}
      <div className="py-4 flex gap-6">
        {/* Phần bên trái: Hiển thị các comment mới nhất */}
        <div className="w-[35%] p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Blog Comments Newest
          </h2>
          <ul className="space-y-2 px-4">
            {latestComments?.map((comment) => (
              <li key={comment._id} className="border-b border-gray-300 pb-2">
                <div className="text-md font-semibold text-gray-700">
                  {comment.postTitle}
                </div>
                <div className="flex items-center gap-3 text-gray-700 mb-2">
                  <img
                    src={comment?.postedBy?.avatar || avt}
                    alt="avatar"
                    className="w-10 h-10 object-cover rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <span className="font-semibold text-blue-500 block">
                      {`${comment.postedBy?.lastname || "N/A"} ${
                        comment.postedBy?.firstname || ""
                      }`}
                    </span>
                    <p className="text-gray-500 text-xs">
                      {moment(comment.createdAt).format(
                        "MMM DD, YYYY [at] hh:mm A"
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-gray-600 italic line-clamp-1">
                  "{comment.content}"
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Phần bên phải: Biểu đồ */}
        <div className="w-[65%] p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            5 Blog Post Newest
          </h2>
          <div className="">
            <Bar
              data={blogData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/*6-New Order */}
      <div className="w-full py-4">
        <Link to={`/${path.ADMIN}/${path.MANAGE_ORDER}`}>
          <div className="w-full flex flex-col items-center gap-2 justify-center p-5 text-main bg-[#deeae1a1] shadow-md rounded-[20px]">
            <h2 className="text-3xl font-semibold text-gray-600">New Order</h2>

            {newestOrders?.length > 0 && (
              <div className="mt-2">
                <table className="w-full table-auto mt-2">
                  <thead className="text-gray-500 text-[15px] text-left">
                    <tr className="border-b border-[#addea0]">
                      <th className="px-2 py-2">#</th>
                      <th className="px-2 py-2">User</th>
                      <th className="px-2 py-2">Product</th>
                      <th className="px-2 py-2">Total</th>
                      <th className="px-2 py-2">P.Method</th>
                      {/* <th className="px-2 py-2">Status</th> */}
                      <th className="px-2 py-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newestOrders.map((el, index) => (
                      <tr key={el._id} className="font-light text-[13px] border-b border-[#addea0]">
                        <td className="px-4 py-2 border-b border-[#addea0]">{index + 1}</td>
                        <td className="px-2 py-2">
                          <span className="flex flex-col">
                            <span className="font-medium">
                              {el.orderBy?.lastname || "N/A"}{" "}
                              {el.orderBy?.firstname || "N/A"}
                            </span>

                            <span>{el.orderBy?.mobile}</span>
                          </span>
                        </td>

                        <td className="px-2 py-2">
                          <span className="flex flex-col">
                            {el.products?.map((item) => (
                              <span key={item._id} className="py-2 flex gap-3">
                                <img
                                  src={item.image}
                                  alt="img"
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="flex flex-col my-auto">
                                  <span className="text-main text-sm font-semibold">
                                    {item.title}
                                  </span>
                                  <span className="gap-2 font-light flex items-center">
                                    <span>Quantity: </span>
                                    <span>{item.quantity}</span>
                                  </span>
                                  <span className="gap-2 font-light flex items-center">
                                    <span>Color: </span>
                                    <span>{item.color}</span>
                                  </span>
                                </span>
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="px-2 py-2">{`${formatMoney(
                          el.total
                        )} VNĐ`}</td>
                        <td className="px-2 py-2">{el.paymentMethod}</td>
                        {/* <td className="py-2 px-2">{el.status}</td> */}
                        <td className="px-2 py-2">
                          {moment(el.createdAt).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
