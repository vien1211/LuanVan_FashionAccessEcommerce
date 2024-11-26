import React from 'react'
const CustomHTMLWidget = ({ htmlContent }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }} // Render HTML trực tiếp
      />
    );
  };
  export default CustomHTMLWidget