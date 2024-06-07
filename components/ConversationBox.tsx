import React from "react";
import styles from "./Conversation.module.css";

interface ConversationBoxProps {
  conversation: any;
  isLoading: boolean;
}

const ConversationBox:React.FC<ConversationBoxProps> = (props) => {
  const { conversation } = props;

  return (
    <div className={styles.conversationbox}>
      <div id="container" className={styles.conversationContent}>
        {conversation?.map((eachConversation, key) => {
          if (eachConversation?.role === "user") {
            return (
              <div key={key} className={styles.userBox}>
                <p className={styles.userContent}>
                  {eachConversation?.content?.message}
                </p>
              </div>
            );
          }
          return (
            <div key={key} className={styles.assistantBox}>
              {eachConversation?.content?.type === "text" ? (
                <p className={styles.content}>
                  {eachConversation?.content?.message}
                </p>
              ) : (
                <img
                  className={styles.img}
                  src={eachConversation?.content?.message}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationBox;
