import React, { useEffect } from "react";
import { Banner, Sidebar, BestSellers, DealDaily } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../ultils/icons";
import { fetchBrands } from "../../store/brand/AsyncAction";
import { Link } from "react-router-dom";
import MiniBanner from "../../components/MiniBanner";
import Slider from "react-slick";

const { MdKeyboardDoubleArrowRight } = icons;

const settings = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 6,
  slidesToScroll: 1,
};

const Home = () => {
  const { categories } = useSelector((state) => state.app);
  const { brands } = useSelector((state) => state.brand);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const shuffledCategories = categories
    ?.filter((el) => el?.title.length > 0)
    ?.sort(() => 0.5 - Math.random()) // Shuffle the array
    ?.slice(0, 9); // Get the first 9 elements

  return (
    <>
      <div className="w-main flex">
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
          <Banner />
          <BestSellers />
          <MiniBanner />
        </div>
      </div>

      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          OUR CATEGORY COLLECTION
        </h3>
        <div className="flex flex-wrap gap-4 mt-4 min-h-[180px]">
          {shuffledCategories?.map((el) => (
            <Link to={`/${el.title}`} key={el._id} className="w-[396px]">
              <div className="border border-main rounded-[20px] flex p-4 gap-4">
                <img
                  src={el.image}
                  alt={el.title}
                  className="flex-1 w-[144px] h-[170px] rounded-[20px] object-cover"
                />
                <div className="flex-1 flex items-center justify-center">
                <h4 className="font-semibold text-[20px] uppercase text-transparent bg-clip-text bg-gradient-to-t from-main to-[#3B5442] drop-shadow-md">
              {el.title}
            </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          OUR BRAND COLLECTION
        </h3>

        <div className=" gap-4 mt-6 p-2 px-4 border justify-center bg-gradient-to-br from-main to-[#3B5442] rounded-[20px]">
          <Slider {...settings}>
            {brands?.map((el) => (
              <Link
                to={`/products?brand=${el.title}`}
                key={el._id}
                className="w-[150px]"
              >
                <div className=" flex flex-col p-4 gap-2 items-center">
                  <img
                    src={el.image}
                    alt={el.title}
                    className="w-[100px] h-[100px] object-contain rounded-full border-2 border-[#7ca07a] bg-white"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[16px] text-white uppercase">
                      {el.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      </div>

      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          BLOGS
        </h3>
      </div>
    </>
  );
};

export default Home;
