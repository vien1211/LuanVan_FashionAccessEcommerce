import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    console.log(message);
    actions.handleUserQuestion(message); 
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
          // actions: actions, 
        });
      })}
    </div>
    // <div>
    // <div>{children}</div> {/* Khu vực hiển thị tin nhắn */}
    // <ChatInput parse={parse} /> {/* Khu vực nhập tin nhắn */}
  // </div>
  );
};

export default MessageParser;