import React from 'react';

const MessageWithHTML = ({ message }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default MessageWithHTML;
