import path from "./path";
import icons from "./icons";


export const navigation = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "OUR SERVICES",
    path: `/${path.OUR_SERVICE}`,
  },
  {
    id: 5,
    value: "FAQs",
    path: `/${path.FAQ}`,
  },
 
];

export const colors = ["Black", "Red", "Blue", "Yellow", "Beige", "Pink", "White", "Green", "Pink Gold", "White Gold", "Gold", "Brown", "Starlight"];

export const sorts = [
  {
    id: 1,
    value: "-createdAt",
    text: "All Product ",
  },
  {
    id: 2,
    value: "-sold",
    text: "Popular ",
  },
  {
    id: 3,
    value: "title",
    text: "Alphabetically, A-Z",
  },
  {
    id: 4,
    value: "-title",
    text: "Alphabetically, Z-A",
  },
  {
    id: 5,
    value: "price",
    text: "Price, low to high ",
  },
  {
    id: 6,
    value: "-price",
    text: "Price, high to low ",
  },
  {
    id: 7,
    value: "-createdAt",
    text: "Date, new to old ",
  },
  {
    id: 8,
    value: "createdAt",
    text: "Date, old to new ",
  },
];

export const ReviewOption = [
  {
    id: 1,
    text: "Terrible",
  },
  {
    id: 2,
    text: "Bad",
  },
  {
    id: 3,
    text: "Neutral",
  },
  {
    id: 4,
    text: "Good",
  },
  {
    id: 5,
    text: "Perfect",
  },
];

const {
  TbLayoutDashboardFilled,
  RiGroupFill,
  SiPiapro,
  PiNotepadFill,
  IoHome,
  BsFillPersonFill,
  HiShoppingBag,
  RiHistoryLine,
  PiListHeartBold,
  SiBraintree,
  SiC,
  RiLoginCircleLine,
  FaTruckMonster,
  PiWarehouseFill,
  FaWarehouse,
  TbPackageImport,
  FaBlog,
  FaCoins,
  FaHouseFlag,
  MdDiscount
} = icons;

export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Back To Home",
    path: `/${path.HOME}`,
    icon: <IoHome size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Dashboard",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <TbLayoutDashboardFilled size={20} />,
  },
  {
    id: 3,
    type: "SINGLE",
    text: "Manage User",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <RiGroupFill size={20} />,
  },
  {
    id: 4,
    type: "PARENT",
    text: "Manage Product",
    icon: <SiPiapro size={20} />,
    submenu: [
      {
        text: "Create Product",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
      },
      {
        text: "Manage Product",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
      },
    ],
  },
  {
    id: 5,
    type: "SINGLE",
    text: "Manage Order",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <PiNotepadFill size={20} />,
  },
  {
    id: 6,
    type: "PARENT",
    text: "Manage Category",
    icon: <SiC size={20} />,
    submenu: [
      {
        text: "Create Category",
        path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`,
      },
      {
        text: "Manage Category",
        path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`,
      },
    ],
  },
  {
    id: 7,
    type: "PARENT",
    text: "Manage Brand",
    icon: <SiBraintree size={20} />,
    submenu: [
      {
        text: "Create Brand",
        path: `/${path.ADMIN}/${path.CREATE_BRAND}`,
      },
      {
        text: "Manage Brand",
        path: `/${path.ADMIN}/${path.MANAGE_BRAND}`,
      },
    ],
  },
  {
    id: 8,
    type: "PARENT",
    text: "Manage Supplier",
    icon: <FaHouseFlag size={20} />,
    submenu: [
      {
        text: "Add Supplier",
        path: `/${path.ADMIN}/${path.ADD_SUPPLIER}`,
      },
      {
        text: "Manage Supplier",
        path: `/${path.ADMIN}/${path.MANAGE_SUPPLIER}`,
      },
    ],
  },
  {
    id: 9,
    type: "SINGLE",
    text: "Inventory",
    path: `/${path.ADMIN}/${path.INVENTORY}`,
    icon: <FaWarehouse size={20} />,
  },
  {
    id: 10,
    type: "PARENT",
    text: "Goods Receipt",
    icon: <TbPackageImport size={20} />,
    submenu: [
      {
        text: "Import Goods",
        path: `/${path.ADMIN}/${path.IMPORT_GOODS}`,
      },
      {
        text: "Manage Goods Receipt",
        path: `/${path.ADMIN}/${path.MANAGE_GOODS_RECEIPT}`,
      },
    ],
  },
  {
    id: 11,
    type: "PARENT",
    text: "Blog",
    icon: <FaBlog size={20} />,
    submenu: [
      {
        text: "Manage Blog Category",
        path: `/${path.ADMIN}/${path.MANAGE_BLOG_CATEGORY}`,
      },
      {
        text: "Create Blog Post",
        path: `/${path.ADMIN}/${path.CREATE_BLOG_POST}`,
      },
      {
        text: "Manage Blog Post",
        path: `/${path.ADMIN}/${path.MANAGE_BLOG_POST}`,
      },
    ],
  },
  {
    id: 12,
    type: "SINGLE",
    text: "Revenue & Profit",
    path: `/${path.ADMIN}/${path.PROFIT}`,
    icon: <FaCoins size={20} />,
  },
  {
    id: 13,
    type: "SINGLE",
    text: "Coupon Discount",
    path: `/${path.ADMIN}/${path.COUPON}`,
    icon: <MdDiscount size={20} />,
  }
];

export const memberSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Back To Home",
    path: `/${path.HOME}`,
    icon: <IoHome size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Personal",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <BsFillPersonFill size={20} />,
  },
  // {
  //   id: 3,
  //   type: "SINGLE",
  //   text: "My Cart",
  //   path: `/${path.MEMBER}/${path.MY_CART}`,
  //   icon: <HiShoppingBag size={20} />,
  // },
  {
    id: 3,
    type: "SINGLE",
    text: "Ordered History",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <RiHistoryLine size={20} />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "WishList",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <PiListHeartBold size={20} />,
  },
  {
    id: 5,
    type: "SINGLE",
    text: "Blog List",
    path: `/${path.MEMBER}/${path.M_BLOG_LIST}`,
    icon: <FaBlog size={20} />,
  },
  
];

export const roles = [
  {
    code: 99,
    value: "Admin",
  },
  {
    code: 22,
    value: "User",
  },
];

export const blockStatus = [
  {
    code: true,
    value: "Block",
  },
  {
    code: false,
    value: "Active",
  },
];

export const statusOrder = [
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Awaiting",
    value: "Awaiting Confirmation",
  },
  {
    label: "Confirmed",
    value: "Confirmed",
  },
  {
    label: "Shipped",
    value: "Shipped Out",
  },
  {
    label: "On Delivery",
    value: "On Delivery",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
  {
    label: "Success",
    value: "Success",
  },
];

export const paymentStatuses = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Failed', label: 'Failed' },
];

export const dateOptions = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: '3 ngày trước', value: 'threeDaysAgo' },
  { label: 'Tất cả', value: 'all' }
];