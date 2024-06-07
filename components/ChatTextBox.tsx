import React, { useState } from "react";
import { Input } from "antd";
import styles from "./ChatBox.module.css";
const { Search } = Input;

interface ChatTextBoxProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatTextBox:React.FC<ChatTextBoxProps>  = (ChatTextBoxProps)=> {
  const { onSendMessage, isLoading } = ChatTextBoxProps;
  const [message, setMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    onSendMessage(message);
    setMessage("")
  };

  return (
    <div className={styles.chatWindow}>
      <Search
        loading={isLoading}
        value={message}
        onChange={handleChange}
        placeholder="Enter Message"
        size="large"
        enterButton="Search"
        onPressEnter={handleSubmit}
        onSearch={handleSubmit}
      />
    </div>
  );
};

export default ChatTextBox;
