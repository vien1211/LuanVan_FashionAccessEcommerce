import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis";
import ProductImages from "./Components/ProductImages";
import ProductCard from "./Components/ProductCard";
import { Link } from "react-router-dom";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [bestSeller, setBestSeller] = useState(null);


  const handleBestSeller = async () => {
    try {
      const response = await apiGetProducts({ sort: "-sold", limit: "1" });
      if (response?.success && response.productData.length > 0) {
        const product = response.productData[0];
        setBestSeller(product);

        // Tạo thông điệp với tên và số lượt bán
        const message = createChatBotMessage(
          `The best selling product is: ${product.title} with ${product.sold} sold.`
        )

        // Thêm tin nhắn với hình ảnh sản phẩm
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));

        // Tạo một thông điệp mới với component ProductImages
        const imageMessage = createChatBotMessage(
          <ProductImages images={product.images} />,
          { withAvatar: true }
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, imageMessage],
        }));
      } else {
        const message = createChatBotMessage(
          "Product Not Found."
        );
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      const message = createChatBotMessage(
        "Sorry, unable to get product information."
      );
      setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    }
  };

  const handleCategoryProducts = async (category) => {
    try {
      const response = await apiGetProducts({ category, limit: "3" });
      if (response?.success && response.productData.length > 0) {
        const message = createChatBotMessage(
          `Here are some products from the category "${category}":`
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));

        response.productData.forEach(product => {
          const productCardMessage = createChatBotMessage(
            <ProductCard product={product} />,
            { withAvatar: true }
            
          );

          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, productCardMessage],
          }));
        });

        const viewMoreButton = createChatBotMessage(
          <a href={`/${category}`} style={{ color: 'white', textDecoration: 'underline' }}>
            View More
          </a>,
          { withAvatar: true }
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, viewMoreButton],
        }));
      } else {
        const message = createChatBotMessage("No products found in this category.");
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch category products:", error);
      const message = createChatBotMessage("Sorry, unable to get products for this category.");
      setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    }
  };

  const handleBrandProducts = async (brand) => {
    try {
      const response = await apiGetProducts({ brand, limit: "3" });
      if (response?.success && response.productData.length > 0) {
        const message = createChatBotMessage(
          `Here are some products from the brand "${brand}":`
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));

        response.productData.forEach(product => {
          const productCardMessage = createChatBotMessage(
            <ProductCard product={product} />,
            { withAvatar: true }
          );

          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, productCardMessage],
          }));
        });

        const viewMoreButton = createChatBotMessage(
          <a href={`products?brand=${brand}`} style={{ color: 'white', textDecoration: 'underline' }}>
            View More
          </a>,
          { withAvatar: true }
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, viewMoreButton],
        }));
      } else {
        const message = createChatBotMessage("No products found for this brand.");
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch brand products:", error);
      const message = createChatBotMessage("Sorry, unable to get products for this brand.");
      setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    }
  };

  const handleRecommendProduct = async (category) => {
    try {
      const response = await apiGetProducts({ sort: "-totalRatings", limit: "10" });
      if (response?.success && response.productData.length > 0) {

        // Randomly select a product from the high-rated products
        const randomProduct = response.productData[Math.floor(Math.random() * response.productData.length)];

        // Create a message recommending the product
        const message = createChatBotMessage(
          `I recommend trying the ${randomProduct.title}, which has an excellent rating of ${randomProduct.totalRatings} stars!`
        );

        // Add the message to the chatbot
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));

        // Display product details with an image
        const productCardMessage = createChatBotMessage(
          <ProductCard product={randomProduct} />,
          { withAvatar: true }
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, productCardMessage],
        }));

        // Optional: Include a 'View Product' link
        const viewProductLink = createChatBotMessage(
          <Link to={`/${randomProduct.category}/${randomProduct._id}/${randomProduct.title}`} style={{ color: '#FFE7B4', textDecoration: 'underline' }}>
            View Product
          </Link>,
          { withAvatar: true }
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, viewProductLink],
        }));

      } else {
        // Handle case if no product data is available
        const message = createChatBotMessage("Sorry, I couldn't find any products to recommend at the moment.");
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
      }
    } catch (error) {
      console.error("Failed to fetch recommended product:", error);
      const message = createChatBotMessage("Sorry, I am unable to fetch product recommendations right now.");
      setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    }
};


const handleUserQuestion = (userMessage) => {
    const normalizedMessage = userMessage.toLowerCase();
    // Kiểm tra sản phẩm bán chạy nhất
    if (
      normalizedMessage.includes("sản phẩm bán chạy nhất") ||
      normalizedMessage.includes("best seller") ||
      normalizedMessage.includes("which products are the best sellers")
    ) {
      handleBestSeller();
    } 
    // Kiểm tra danh mục sản phẩm
    else {
      const categoryMatch = normalizedMessage.match(/(sunglasses product|watch product|necklace product|hand bag product|ring product|hat product|earrings product|bracelet product|belt product|smart watch product|smartphone case product|wallet product)/i);
      if (categoryMatch) {
        const category = categoryMatch[0].replace(" product", ""); 
        handleCategoryProducts(category);
        return;
      }

      // Kiểm tra thương hiệu sản phẩm
      const brandMatch = normalizedMessage.match(/(pandora brand|cartier brand)/i);
      if (brandMatch) {
        const brand = brandMatch[0].replace(" brand", ""); 
        handleBrandProducts(brand);
        return; 
      }
    // Cách tạo Blog
      if (
        normalizedMessage.includes("how to create a blog") ||
        normalizedMessage.includes("cách tạo blog") ||
        normalizedMessage.includes("i want to become blogger") ||
        normalizedMessage.includes("create blog") ||
        normalizedMessage.includes("hướng dẫn tạo blog")
      ) {
        const message = createChatBotMessage(
            <>
              To create a blog, follow these steps: <br />
              1. You must be logged in to the platform. If you are not logged in then, click here to{" "}
              <Link to="/login" style={{ color: '#FFE7B4', textDecoration: 'underline' }}>Log In</Link>. <br />
              2. Navigate to "Blogs" in the menu or click here:{" "}
              <Link to="/blogs" style={{ color: '#FFE7B4', textDecoration: 'underline' }}>Blogs</Link>. <br />
              3. On the Blogs page, click the  <Link to="member/m-blog" style={{ color: '#FFE7B4', textDecoration: 'underline' }}>"Create Blog Post"</Link> button to get started. <br />
              4. Before creating a new blog post, prepare your image thumbnail. If not, a default thumbnail will be used. <br />
              5. Write your post and click "Publish" to share it. <br />
              <br />
              You can also comment and reply to users' comments on your post.
            </>
          );
          
      
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        return;
      }

      if (
        normalizedMessage.includes("recommend a product") ||
        normalizedMessage.includes("can you recommend a product for me") ||
        normalizedMessage.includes("gợi ý sản phẩm") ||
        normalizedMessage.includes("tư vấn sản phẩm")
      ) {
        handleRecommendProduct();
        return;
      }
      
      
      
      // Nếu không tìm thấy gì
      const message = createChatBotMessage("Sorry, I don't understand your question.");
      setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleUserQuestion },
        });
      })}
    </div>
   
  );
};

export default ActionProvider;





