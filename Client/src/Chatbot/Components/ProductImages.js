import React, { useState } from 'react';
import Modal from 'react-modal';
import { IoCloseCircle } from "react-icons/io5";

// Thiết lập phần tử gốc của ứng dụng
Modal.setAppElement('#root');

const ProductImages = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image); 
    setIsOpen(true); 
  };

  const closeModal = () => {
    setIsOpen(false); 
    setSelectedImage(null); 
  };

  return (
    <div className='flex flex-wrap gap-1'>
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`product-${index}`}
          className='h-20 w-20 object-cover cursor-pointer rounded-lg hover:scale-95 duration-200' 
          onClick={() => openModal(imageUrl)} 
        />
      ))}

      {/* Modal hiển thị ảnh lớn */}
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className='font-main'>Product Image</h2>
          <button onClick={closeModal}><IoCloseCircle size={24} color='#952E41'/></button>
        </div>
        {selectedImage && (
          <img src={selectedImage} alt="large product" className='max-w-full h-[500px] py-2' />
        )}
      </Modal>
    </div>
  );
};

// Style cho modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default ProductImages;
