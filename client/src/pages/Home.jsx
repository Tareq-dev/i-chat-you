import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { VscKebabVertical } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router";
import socket from "../socket";
function Home() {
    const myId = localStorage.getItem("userId");
    const [chats, setChats] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();
    const me = localStorage.getItem("username");
    const handleLogout = () => {
        // 🔥 localStorage clear
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");

        // 🔥 socket disconnect (important)
        if (socket?.connected) {
            socket.disconnect();
        }

        // 🔥 settings close
        setShowSettings(false);

        // 🔥 login page এ পাঠাও
        navigate("/login");
    };
    useEffect(() => {
        const fetchChats = async () => {
            if (myId === null) return;
            const res = await fetch(
                `http://localhost:5000/api/conversation/user/${myId}`
            );

            const data = await res.json();
            setChats(data);
        };

        fetchChats();
    }, [myId]);
    // 🔍 API CALL (ONLY ON BUTTON CLICK)
    const searchUsers = async () => {
        if (!searchText.trim()) return;

        try {
            setLoading(true);
            const res = await fetch(
                `http://localhost:5000/api/users/search/${searchText}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();

            // 👇 ALWAYS ARRAY
            if (Array.isArray(data)) {
                setSearchResult(data);
                setSearchText("");
            } else if (data && data._id) {
                setSearchResult([data]);
                setSearchText("");
            } else {
                setSearchResult([]);
            }

        } catch (err) {
            console.error("Search error", err);
            setSearchResult([]);
        } finally {
            setLoading(false);
        }
    };
    const openConversation = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    const openChat = async (user) => {
        console.log(user)
        const myId = localStorage.getItem("userId");

        const res = await fetch("http://localhost:5000/api/conversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                senderId: myId,
                receiverId: user._id
            })
        });

        const conversation = await res.json();
        // 👉 REAL individual chat

        navigate(`/chat/${conversation._id}`);
    };
    return (
        <div className="h-155 max-w-md mx-auto bg-gray-900  text-white shadow-lg overflow-hidden relative">

            <div className="flex justify-between items-center px-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="border border-gray-400 rounded-full w-7 h-7 flex justify-center items-center"
                    >
                        <VscKebabVertical className="font-extrabold" size={18} />
                    </button>
                    <p className="capitalize font-bold bungee-regular">{me}</p>
                </div>
                <h1 className="text-3xl py-3 font-extrabold ml-2 bungee-regular text-purple-400">
                    I<span className="text-white">C</span>U
                </h1>
            </div>


            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <p className="text-lg font-semibold open-sans-trk">Messages</p>

                <div className="flex gap-2">
                    {/* SEARCH BUTTON */}
                    <button
                        onClick={() => {
                            if (!searchOpen) {
                                setSearchOpen(true);
                            } else {
                                searchUsers();
                            }
                        }}
                        className="border border-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                    >
                        <FiSearch size={14} />
                    </button>

                    {/* CLOSE BUTTON */}
                    {searchOpen && (
                        <button
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchText("");
                                setSearchResult([]);
                            }}
                            className="border border-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                        >
                            <IoClose size={16} />
                        </button>
                    )}


                </div>
            </div>

            {/* Search Input */}
            {searchOpen && (
                <div className="px-4 mt-2">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm outline-none"
                    />
                </div>
            )}

            {/* Search Result */}
            {searchOpen && (
                <div className="px-4 mt-3 max-h-60 overflow-y-auto">
                    {loading && (
                        <p className="text-sm text-gray-400">Searching...</p>
                    )}

                    {!loading && searchText && searchResult.length === 0 && (
                        <p className="text-sm text-gray-400">No user found</p>
                    )}
                    {searchResult.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center border border-gray-600 justify-between p-2 rounded hover:bg-gray-700"
                        >
                            <div className="flex gap-4">
                                <p className="text-sm ml-2 font-medium">{user.username}</p>

                                <div className="flex items-center gap-1 text-xs">
                                    <span
                                        className={`w-2 h-2 rounded-full ${user.online ? "bg-green-500" : "bg-gray-500"
                                            }`}
                                    ></span>

                                    <span className="text-gray-400">
                                        {user.online ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => openChat(user)} className="bg-green-800 px-3 cursor-pointer py-1 rounded">Chat</button>
                        </div>
                    ))}
                </div>
            )}

            {/* User List */}
            {/* <div
                className={`mt-3 overflow-y-auto h-full bg-gray-800 rounded-t-3xl ${searchOpen ? "opacity-40 pointer-events-none" : ""
                    }`}
            >
                {chats.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => openChat(user)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer"
                    >
                        <img
                            src={'https://i.pravatar.cc/150?img=2'}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p>{user.name}</p>
                                <span className="text-xs text-gray-400">
                                    {user.time}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                                {user.lastMessage}
                            </p>
                        </div>

                        {user.unread > 0 && (
                            <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                                {user.unread}
                            </span>
                        )}
                    </div>
                ))}
            </div> */}
            <div className="max-w-md mx-auto bg-gray-800 rounded-t-3xl min-h-screen text-white">

                {chats?.map((c) => {
                    // 🔥 receiver বের করা
                    const receiver = c.participants.find(
                        (u) => u._id !== myId
                    );
                    if (!receiver) return null; // 🔥 safety

                    return (
                        <div
                            key={c._id}
                            onClick={() => openConversation(c._id)}
                            className="px-4 py-2 flex justify-between items-center border-b border-gray-700 cursor-pointer hover:bg-gray-800"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <img
                                        src={'https://i.pravatar.cc/150?img=2'}
                                        alt={c.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className=" open-sans-trk capitalize">
                                            {receiver?.username}
                                        </p>
                                        <p className="text-sm open-sans-trk text-gray-400 truncate max-w-50">
                                            {c?.lastMessage || "No messages yet"}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <p className="text-xs text-gray-500 open-sans-trk">
                                {new Date(c.updatedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>
                    );
                })}
            </div>
            {/* Settings */}
            {showSettings && (
                <div
                    onClick={() => setShowSettings(false)}
                    className="absolute inset-0 bg-black/40 flex justify-center items-start pt-20"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-800 w-72 rounded-xl p-4 space-y-3"
                    >
                        <p className="font-semibold text-lg">Settings</p>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded">
                            Profile
                        </button>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-red-400">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
