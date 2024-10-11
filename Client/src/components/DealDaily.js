import React, { useEffect, useState, memo } from "react";
import icons from "../ultils/icons";
import { apiGetProducts } from "../apis/product";
import { Link } from "react-router-dom";
import { formatMoney, renderStar, secondsToHms } from "../ultils/helper";
import moment from "moment";
import { CountDown } from './';

const { ImStarFull, RiMenu5Fill } = icons;
let idInterval;

const DealDaily = () => {
  const [dealDaily, setDealDaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);

  const fetchDealDaily = async () => {
    try {
      const response = await apiGetProducts({ limit: 1, totalRatings: 5 });
      if (response.success && response.productData.length > 0) {
        const product = response.productData[0];
        
        // Lưu sản phẩm vào localStorage
        const today = moment().format('YYYY-MM-DD'); // Lưu theo định dạng ngày
        localStorage.setItem(today, JSON.stringify(product));

        setDealDaily(product);
        setCountdown();
      } else {
        setHour(0);
        setMinute(59);
        setSecond(59);
        console.error("No products found or an error occurred.");
      }
    } catch (error) {
      console.error("Error fetching deal daily:", error);
    }
  };

  const setCountdown = () => {
    const today = moment().format('YYYY-MM-DD');
    const seconds = new Date(`${today} 5:00:00`).getTime() - new Date().getTime() + 24 * 3600 * 1000;
    const number = secondsToHms(seconds);
    setHour(number.h);
    setMinute(number.m);
    setSecond(number.s);
  };

  useEffect(() => {
    clearInterval(idInterval);
    const today = moment().format('YYYY-MM-DD');
    const savedProduct = localStorage.getItem(today);

    if (savedProduct) {
      setDealDaily(JSON.parse(savedProduct));
      setCountdown();
    } else {
      fetchDealDaily();
    }
  }, [expireTime]);

  useEffect(() => {
    idInterval = setInterval(() => {
      if (second > 0) setSecond(prev => prev - 1);
      else {
        if (minute > 0) {
          setMinute(prev => prev - 1);
          setSecond(59);
        } else {
          if (hour > 0) {
            setHour(prev => prev - 1);
            setMinute(59);
            setSecond(59);
          } else {
            setExpireTime(!expireTime);
          }
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(idInterval);
    };
  }, [second, minute, hour, expireTime]);

  return (
    <div className="border border-main border-opacity-40 w-full">
      <div className="flex items-center justify-center mb-4 px-5 py-2 text-white bg-main">
        <span className="flex items-center">
          <ImStarFull className="mr-2 text-yellow-500" />
          <h2 className="text-[24px] font-bold">DEAL DAILY</h2>
        </span>
      </div>

      {dealDaily ? (
        <>
          <Link to={`/${dealDaily.category?.toLowerCase()}/${dealDaily._id}/${dealDaily.title}`} className="px-4 w-full flex flex-col items-center">
            <div className="px-2 pt-2 w-full flex flex-col items-center">
              <img
                src={dealDaily?.images?.[0] || "https://www.proclinic-products.com/build/static/default-product.30484205.png"}
                alt={dealDaily.title || "image"}
                className="w-full h-[250px] object-conver"
              />
              <div className="flex flex-col gap-1 mt-[15px] w-full">
                <h3 className="text-[24px] text-center font-semibold line-clamp-1">
                  {dealDaily.title}
                </h3>
                <div className="flex items-center justify-center w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-main text-[#273526] flex items-center gap-1">
                      {renderStar(dealDaily.totalRatings, 24)}
                    </span>
                    <span className="text-[20px] text-center mt-2 text-[#d66363]">
                      {`${formatMoney(dealDaily.price)} VNĐ`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="px-4 mt-8">
            <div className='flex gap-2 items-center justify-center mb-4'>
              <CountDown unit={'Hours'} number={hour} />
              <CountDown unit={'Minutes'} number={minute} />
              <CountDown unit={'Seconds'} number={second} />
            </div>
            <button
              type="button"
              className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2 mb-4"
            >
              <RiMenu5Fill />
              <span>Option</span>
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading daily deal...</p>
      )}
    </div>
  );
};

export default memo(DealDaily);
