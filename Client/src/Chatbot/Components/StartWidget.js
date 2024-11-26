import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StartWidget = () => {
  const { categories } = useSelector((state) => state.app);
  const navigate = useNavigate();

  // const shuffledCategories = categories
  // ?.filter((el) => el?.title.length > 0)
  // ?.sort(() => 0.5 - Math.random())
  // ?.slice(0, 5);

  const handleCategoryClick = (path) => {
    navigate(path);
  };
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center">
      {categories.slice(0, 5).map((category) => (
        <div
          key={category._id}
          onClick={() => handleCategoryClick(`/${category.title}`)}
          className=" cursor-pointer text-main hover:underline  rounded-full border border-main px-3 py-1 text-[14px]"
        >
          {category.title}
        </div>
      ))}
    </div>
  );
};

export default StartWidget;
