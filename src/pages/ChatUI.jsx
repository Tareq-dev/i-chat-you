import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { BiSend } from "react-icons/bi";

const users = [
    { name: "Rahim", avatar: "https://i.pravatar.cc/150?img=1", online: true },
    { name: "Karim", avatar: "https://i.pravatar.cc/150?img=2", online: false },
    { name: "Jamal", avatar: "https://i.pravatar.cc/150?img=3", online: true },
];

const ChatUI = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const chatRef = useRef(null);

    // find user from param
    useEffect(() => {
        const user = users.find(
            (u) => u.name.toLowerCase() === name.toLowerCase()
        );
        setActiveUser(user);
    }, [name]);

    // auto scroll
    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { text: input, sender: "me" }]);
        setInput("");
    };

    return (
        <div className="h-[600px] max-w-md mx-auto bg-gray-900 text-white overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-gray-800 p-4 flex items-center gap-3">
                <button className="cursor-pointer" onClick={() => navigate("/")}><IoIosArrowBack size={24} /></button>

                {activeUser && (
                    <>
                        <div className="relative">
                            <img
                                src={activeUser.avatar}
                                className="w-8 h-8 rounded-full"
                                alt={activeUser.name}
                            />
                            <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${activeUser.online ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            />
                        </div>
                        <p className="font-semibold">{activeUser.name}</p>
                    </>
                )}
            </div>

            {/* Messages */}
            <div
                ref={chatRef}
                className="flex-1 p-4 space-y-3 overflow-y-auto hide-scrollbar"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div className="bg-purple-600 px-3 py-2 rounded-lg text-sm">
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            {/* Input */}
            <div className="p-3 bg-gray-800">
                <div className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);

                            e.target.style.height = "auto";

                            const maxHeight = 120; // px (≈ 6 lines)
                            e.target.style.height =
                                Math.min(e.target.scrollHeight, maxHeight) + "px";
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        placeholder="Type a message..."
                        className="
        flex-1
        px-3 py-2
        text-sm
        rounded-lg
        bg-gray-700
        text-white
        outline-none
        resize-none
        leading-5
        max-h-30
        overflow-y-auto
      "
                    />

                    <button
                        onClick={sendMessage}
                        className="
        w-10 h-10
        bg-green-600
        text-white
        rounded-full
        flex
        items-center
        justify-center
        shrink-0
      "
                    >
                        <BiSend size={18} />
                    </button>
                </div>
            </div>


        </div>
    );
};

export default ChatUI;
