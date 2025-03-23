import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatBot.css";
import {
  SendHorizontal,
  CircleStop,
  Trash2,
  BotMessageSquare,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "You are a customer support representative for an AI interview platform where users can take AI-generated interviews, receive feedback, get correct answers and also find job postings. They can schedule thousands of interviews for free. The platform also includes AI monitoring for stance and facial expressions during interviews. Your job is to replace a real human in customer support, responding naturally like a human agent. Keep your answers short and to the point. Do not use headings, special characters, or long explanations. Keep it simple and conversational.",
      sender: "info",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [typingResponse, setTypingResponse] = useState(""); // For typing effect
  const [stopTyping, setStopTyping] = useState(false); // Stop typing state
  const typingIntervalRef = useRef(null); // Ref to store the interval ID

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAdtsEDWlJmMYPYL_kKaHKEwQBdoZEeRfg"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const sendMessage = async () => {
    if (prompt.trim()) {
      const newMessages = [...messages, { text: prompt, sender: "user" }];
      setMessages(newMessages);
      console.log(newMessages);
      setPrompt("");
      setIsLoading(true); // Start loading
      setStopTyping(false); // Reset stop typing state

      try {
        // Format the messages for AI input
        const formattedMessages = newMessages
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");

        const result = await model.generateContent(formattedMessages);
        let response = await result.response.text();

        // Format AI response (adding *** for headings and better readability)
        response = formatAIResponse(response);

        // Simulate typing effect
        let index = 0;
        typingIntervalRef.current = setInterval(() => {
          if (index < response.length && !stopTyping) {
            setTypingResponse((prev) => prev + response.charAt(index));
            index++;
          } else {
            clearInterval(typingIntervalRef.current); // Clear interval
            setIsLoading(false); // Stop loading
            setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
            setTypingResponse(""); // Reset typing response
          }
        }, 10); // Adjust typing speed (milliseconds)
      } catch (error) {
        console.error("Error generating content:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error generating response", sender: "bot" },
        ]);
        setIsLoading(false); // Stop loading
      }
    }
  };

  // Function to format AI response with headings and structure
  const formatAIResponse = (text) => {
    return text
      .replace(/^# (.*$)/gm, "***$1***") // Convert Markdown-style headings (# Heading) to ***Heading***
      .replace(/\*\*(.*?)\*\*/g, "***$1***") // Convert bold text to ***
      .replace(/\n- /g, "\n👉 ") // Convert list items (- item) to 👉 item
      .replace(/\n\d+\. /g, "\n🔹 "); // Convert numbered lists (1. item) to 🔹 item
  };

  const handleStopTyping = () => {
    setStopTyping(true); // Stop the typing effect
    clearInterval(typingIntervalRef.current); // Clear the interval
    setIsLoading(false); // Stop loading
  };

  const handleClearAll = () => {
    setMessages([]); // Clear all messages
    setTypingResponse(""); // Clear typing response
    setPrompt(""); // Clear input
    setIsLoading(false); // Stop loading
    setStopTyping(false); // Reset stop typing state
    clearInterval(typingIntervalRef.current); // Clear any active interval
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="">
      <div className="flex items-center space-x-3">
        <Image src={"/images/logo.webp"} width={50} height={100} alt="logo" />
        <h1 className="text-xl">AI-Saathi</h1>
      </div>

      <div className="conversation ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === "user"
                ? "user-message"
                : msg.sender === "bot"
                ? "bot-message"
                : "hidden"
            } flex w-4/5`}
          >
            {msg.sender === "bot" && <BotMessageSquare width={100} />}
            {msg.text}
            {msg.sender === "user" && <UserCheck />}
          </div>
        ))}
        {isLoading && (
          <div className="bot-message">
            <BotMessageSquare />
            ...
          </div> // Show "..." while loading
        )}
        {typingResponse && (
          <div className="bot-messagee">{typingResponse}</div> // Show typing response
        )}
      </div>
      <div className="input flex justify-end w-full absolute bottom-3 right-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Ask Anything"
        />
        <button onClick={sendMessage}>
          {/* <BsFillSendFill /> */}
          <SendHorizontal />
        </button>
        {isLoading && ( // Show stop button only when loading
          <button onClick={handleStopTyping}>
            <CircleStop />
          </button>
        )}
        <button onClick={handleClearAll}>
          {/* <BsTrash /> Trash icon for clear all */}
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
