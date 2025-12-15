
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { BiSend } from "react-icons/bi";
import socket from "../socket";

const ChatUI = () => {
    const { conversationId } = useParams();
    const myId = localStorage.getItem("userId");
    const myName = localStorage.getItem("username");
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const chatRef = useRef(null);
    const textareaRef = useRef(null);
    useEffect(() => {
        const fetchConversation = async () => {
            const res = await fetch(
                `http://localhost:5000/api/messages/${conversationId}`
            );
            const data = await res.json();
            // 🔥 receiver বের করা
            setMessages(data);
        };

        fetchConversation();
    }, [conversationId]);
    useEffect(() => {
        socket.emit("join_conversation", conversationId);
    }, [conversationId]);

    useEffect(() => {
        // auto scroll
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);

        // seen emit only if receiver exists
        if (activeUser?._id) {
            socket.emit("seen", {
                conversationId,
                senderId: myId,
                receiverId: activeUser._id
            });
        }
    }, [messages, activeUser, conversationId, myId]);

    // Receive message from socket
    useEffect(() => {
        socket.on("receive_message", (message) => {
            // 🔥 নিজের পাঠানো message ignore
            if (message.senderId === myId) return;

            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off("receive_message");
    }, [myId]);


    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("send_message", {
            conversationId,
            senderId: myId,
            text: input
        });

        // optimistic UI
        setMessages((prev) => [
            ...prev,
            { text: input, senderId: myId, createdAt: new Date() }
        ]);

        setInput("");
        // 🔥 textarea reset (IMPORTANT)
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };
    useEffect(() => {
        const fetchConversation = async () => {
            const res = await fetch(
                `http://localhost:5000/api/conversation/${conversationId}`
            );
            const data = await res.json();
            // 🔥 receiver বের করা
            const receiver = data.participants.find(
                (u) => u._id !== myId
            );
            setActiveUser(receiver);
        };

        fetchConversation();
    }, [conversationId]);
    useEffect(() => {
        const fetchChats = async () => {
            const res = await fetch(
                `http://localhost:5000/api/conversation/user/${myId}`
            );
            const data = await res.json();
            setChats(data);
        };

        fetchChats();
    }, [myId]);

    return (
        <div className="h-150 max-w-md mx-auto bg-gray-900 text-white flex flex-col">

            {/* HEADER */}

            <div className="bg-gray-800 p-4 flex items-center gap-3">
                <button onClick={() => navigate("/")}>
                    <IoIosArrowBack size={24} />
                </button>
                <div className="flex justify-between items-center w-full">
                    {activeUser && (
                        <div>
                            <p className="font-semibold capitalize">
                                {activeUser.username}
                            </p>
                            <p className="text-xs font-bold text-green-400">
                                Online
                            </p>
                        </div>
                    )}

                </div>


            </div>
            {/* 
            <div className="bg-gray-800 p-4 flex items-center gap-3">
                <button onClick={() => navigate("/")}>
                    <IoIosArrowBack size={24} />
                </button>

                <div className="flex-1 justify-center items-center">
                    <p className="text-xs text-start font-semibold">Sent TO</p>
                    <p className="text-xs text-end font-semibold">{myName} Signed In</p>

                </div>
            </div> */}

            {/* MESSAGES */}
            <div
                ref={chatRef}
                className="flex-1 p-4 space-y-3 overflow-y-auto hide-scrollbar"
            >
                {messages.map((m, i) => {
                    const isMe = m.senderId === myId;

                    return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div

                            >
                                <p className={`max-w-xs md:max-w-sm px-4 py-1 text-sm rounded-2xl
                                     ${isMe
                                        ? "bg-cyan-600 text-white rounded-br-none"
                                        : "bg-gray-700 text-white rounded-bl-none"}
                                    `}>{m.text}</p>

                                {/* 🕒 time */}
                                <p className={`text-[10px] opacity-60 ${isMe ? "text-right" : "text-left"} mt-0.5`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}



                {typing && (
                    <p className="text-xs text-gray-400 italic">
                        {receiver} typing...
                    </p>
                )}
            </div>

            {/* INPUT */}
            <div className="p-3 bg-gray-800">
                <div className="flex items-end  gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        placeholder="Type here..."
                        onChange={(e) => {
                            setInput(e.target.value);
                            // socket.emit("typing", { sender, receiver });
                            e.target.style.height = "auto";
                            e.target.style.height =
                                Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-700 resize-none"
                    />

                    <button
                        onClick={sendMessage}
                        className="w-10 h-10 bg-cyan-600 cursor-pointer rounded-full flex items-center justify-center"
                    >
                        <BiSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
