import type { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import dynamic from "next/dynamic";
import {chatGPTRoute,dalleRoute} from '../constants'

const DynamicChatBox = dynamic(
  () =>
    import("../components/ChatTextBox").then(
      (defaultComponent) => defaultComponent.default
    ),
  { ssr: false }
);

const DynamicConversationBox = dynamic(
  () =>
    import("../components/ConversationBox").then(
      (defaultComponent) => defaultComponent.default
    ),
  { ssr: false }
);
const Home: NextPage = () => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("log",process.env.CHAT_GPT_TOKEN,process.env.NEXT_PUBLIC_CHAT_GPT_TOKEN)
  const fetchChatGPT = async (message) => {
    try {
      const response = await axios.post(
        chatGPTRoute(),
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message,
                },
              ],
            },
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_CHAT_GPT_TOKEN}`
          },
        },
      );
      setConversation((conversation) => [
        ...conversation,
        {
          role: "assistant",
          content: {
            type: "text",
            message: response?.data?.choices?.[0]?.message?.content,
          },
        },
      ]);
      scrollToBottom();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const fetchDalle = async (message) => {
    try {
      const dalleResponse = await axios.post(
        dalleRoute(),
        {
          model: "dall-e-3",
          prompt: message,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_CHAT_GPT_TOKEN}`
          },
        },
      );

      setConversation((conversation) => [
        ...conversation,
        {
          role: "assistant",
          content: {
            type: "image",
            message: dalleResponse?.data?.data?.[0]?.url,
          },
        },
      ]);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }
  const onSendMessage = async (message: string) => {
    setConversation([
      ...conversation,
      {
        role: "user",
        content: {
          type: "text",
          message,
        },
      },
    ]);
    setIsLoading(true);
    await fetchChatGPT(message)
    await fetchDalle(message)
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    let scrollableDiv = document.getElementById("container");
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  };

  return (
    <div>
      <Head>
        <meta name="description" content="Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DynamicConversationBox isLoading={isLoading} conversation={conversation} />
        <DynamicChatBox isLoading={isLoading} onSendMessage={onSendMessage} />
      </main>
    </div>
  );
};

export default Home;
