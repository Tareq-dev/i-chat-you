// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import { IoIosArrowBack } from "react-icons/io";
// import { BiSend } from "react-icons/bi";
// import socket from "../socket";
// const users = [
//     { name: "Rahim", avatar: "https://i.pravatar.cc/150?img=1", online: true },
//     { name: "Karim", avatar: "https://i.pravatar.cc/150?img=2", online: false },
//     { name: "Jamal", avatar: "https://i.pravatar.cc/150?img=3", online: true },
// ];

// const ChatUI = () => {
//     const { sender, receiver } = useParams();
//     const navigate = useNavigate();
//     const [isTyping, setIsTyping] = useState(false);

//     const [activeUser, setActiveUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const chatRef = useRef(null);
//     //JOIN Socket
//     useEffect(() => {
//         socket.emit("join", sender);

//         socket.on("receiveMessage", (msg) => {
//             setMessages((prev) => [
//                 ...prev,
//                 { text: msg.text, sender: "other" },
//             ]);
//         });
//         socket.on("typing", () => setIsTyping(true));
//         socket.on("stopTyping", () => setIsTyping(false));

//         return () => {
//             socket.off("receiveMessage");
//             socket.off("typing");
//             socket.off("stopTyping");
//         };

//     }, [sender]);
//     useEffect(() => {
//         const user = users.find(
//             (u) => u.name.toLowerCase() === receiver.toLowerCase()
//         );
//         setActiveUser(user);
//     }, [receiver]);
//     // auto scroll
//     useEffect(() => {
//         chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
//     }, [messages]);

//     const sendMessage = () => {
//         if (!input.trim()) return;

//         // show message instantly
//         setMessages((prev) => [...prev, { text: input, sender: "me" }]);

//         // 🔥 SEND TO SOCKET
//         socket.emit("sendMessage", {
//             sender,
//             receiver,
//             text: input,
//         });

//         setInput("");
//     };

//     return (
//         <div className="h-150 max-w-md mx-auto bg-gray-900 text-white overflow-hidden flex flex-col">

//             {/* Header */}
//             <div className="bg-gray-800 p-4 flex items-center gap-3">
//                 <button className="cursor-pointer" onClick={() => navigate("/")}><IoIosArrowBack size={24} /></button>

//                 {activeUser && (
//                     <>
//                         <div className="relative">
//                             <img
//                                 src={activeUser.avatar}
//                                 className="w-8 h-8 rounded-full"
//                                 alt={activeUser.name}
//                             />
//                             <span
//                                 className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${activeUser.online ? "bg-green-500" : "bg-gray-400"
//                                     }`}
//                             />
//                         </div>
//                         <p className="font-semibold">{activeUser.name}</p>
//                     </>
//                 )}
//             </div>

//             {/* Messages */}
//             <div
//                 ref={chatRef}
//                 className="flex-1 p-4 space-y-3 overflow-y-auto hide-scrollbar"
//             >
//                 {messages.map((msg, i) => (
//                     <div
//                         key={i}
//                         className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
//                             }`}
//                     >
//                         <div className="bg-purple-600 px-3 py-2 rounded-lg text-sm">
//                             {msg.text}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {isTyping && (
//                 <div className="text-xs text-gray-400 italic">
//                     {activeUser?.name} is typing...
//                 </div>
//             )}

//             {/* Input */}
//             {/* Input */}
//             <div className="p-3 bg-gray-800">
//                 <div className="flex items-end gap-2">
//                     <textarea
//                         value={input}
//                         onChange={(e) => {
//                             setInput(e.target.value);
//                             socket.emit("typing", { sender, receiver });
//                             e.target.style.height = "auto";

//                             const maxHeight = 120; // px (≈ 6 lines)
//                             e.target.style.height =
//                                 Math.min(e.target.scrollHeight, maxHeight) + "px";
//                         }}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault();
//                                 sendMessage();
//                             }
//                         }}

//                         rows={1}
//                         placeholder="Type a message..."
//                         className="
//         flex-1
//         px-3 py-2
//         text-sm
//         rounded-lg
//         bg-gray-700
//         text-white
//         outline-none
//         resize-none
//         leading-5
//         max-h-30
//         overflow-y-auto
//       "
//                     />

//                     <button
//                         onClick={sendMessage}
//                         className="
//         w-10 h-10
//         bg-green-600
//         text-white
//         rounded-full
//         flex
//         items-center
//         justify-center
//         shrink-0
//       "
//                     >
//                         <BiSend size={18} />
//                     </button>
//                 </div>
//             </div>


//         </div>
//     );
// };

// export default ChatUI;


import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { BiSend } from "react-icons/bi";
import socket from "../socket";

const users = [
    { name: "Rahim", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Karim", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Jamal", avatar: "https://i.pravatar.cc/150?img=3" },
];

const ChatUI = () => {
    const { sender, receiver } = useParams();
    const navigate = useNavigate();

    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const chatRef = useRef(null);

    useEffect(() => {
        socket.emit("join", sender);

        socket.on("receiveMessage", (msg) => {
            setMessages((p) => [...p, { ...msg, status: "delivered" }]);
        });

        socket.on("typing", () => setTyping(true));
        socket.on("stopTyping", () => setTyping(false));
        socket.on("onlineUsers", setOnlineUsers);

        socket.on("delivered", () => {
            setMessages((p) =>
                p.map((m, i) =>
                    i === p.length - 1 ? { ...m, status: "delivered" } : m
                )
            );
        });

        socket.on("seen", () => {
            setMessages((p) =>
                p.map((m) =>
                    m.sender === "me" ? { ...m, status: "seen" } : m
                )
            );
        });

        return () => socket.removeAllListeners();
    }, [sender]);

    useEffect(() => {
        const u = users.find(
            (x) => x.name.toLowerCase() === receiver.toLowerCase()
        );
        if (u)
            setActiveUser({
                ...u,
                online: onlineUsers.includes(receiver),
            });
    }, [receiver, onlineUsers]);

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
        socket.emit("seen", { sender, receiver });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((p) => [
            ...p,
            { text: input, sender: "me", status: "sent" },
        ]);

        socket.emit("sendMessage", { sender, receiver, text: input });
        socket.emit("stopTyping", { receiver });
        setInput("");
    };

    return (
        <div className="h-150 max-w-md mx-auto bg-gray-900 text-white flex flex-col">

            {/* HEADER */}
            <div className="bg-gray-800 p-4 flex items-center gap-3">
                <button onClick={() => navigate("/")}>
                    <IoIosArrowBack size={24} />
                </button>

                {activeUser && (
                    <>
                        <div className="relative">
                            <img
                                src={activeUser.avatar}
                                className="w-8 h-8 rounded-full"
                            />
                            <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${activeUser.online ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            />
                        </div>
                        <p className="font-semibold">{activeUser.name}</p>
                    </>
                )}
            </div>

            {/* MESSAGES */}
            <div
                ref={chatRef}
                className="flex-1 p-4 space-y-3 overflow-y-auto hide-scrollbar"
            >
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${m.sender === "me"
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-gray-700 text-white rounded-bl-none"
                                }`}
                        >
                            {m.text}

                            {m.sender === "me" && (
                                <span className="text-[10px] ml-1 opacity-70">
                                    {m.status === "sent" && "✓"}
                                    {m.status === "delivered" && "✓✓"}
                                    {m.status === "seen" && "👁"}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {typing && (
                    <p className="text-xs text-gray-400 italic">
                        {receiver} typing...
                    </p>
                )}
            </div>

            {/* INPUT */}
            <div className="p-3 bg-gray-800">
                <div className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            socket.emit("typing", { sender, receiver });
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
                        className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
                    >
                        <BiSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
