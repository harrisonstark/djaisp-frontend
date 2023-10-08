import React, { useState } from 'react';

const ChatBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeyPress}
        placeholder="Type your message..."
        style={{
          color: 'black',
          padding: '8px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          flex: 1,
        }}
      />
    </div>
  );
};

export default ChatBox;