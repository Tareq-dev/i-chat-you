import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { VscKebabVertical } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router";

const usersData = [
    {
        id: 1,
        name: "Rahim",
        avatar: "https://i.pravatar.cc/150?img=1",
        lastMessage: "ঠিক আছে 👍",
        time: "10:45 AM",
        unread: 2,
        online: true,
    },
    {
        id: 2,
        name: "Karim",
        avatar: "https://i.pravatar.cc/150?img=2",
        lastMessage: "কাল দেখা হবে",
        time: "09:20 AM",
        unread: 0,
        online: false,
    },
    {
        id: 3,
        name: "Jamal",
        avatar: "https://i.pravatar.cc/150?img=3",
        lastMessage: "ডকুমেন্ট পাঠাইছি",
        time: "Yesterday",
        unread: 5,
        online: true,
    },
    {
        id: 4,
        name: "Sakib",
        avatar: "https://i.pravatar.cc/150?img=4",
        lastMessage: "Thanks bro 🙏",
        time: "Yesterday",
        unread: 0,
        online: false,
    },
];



function Home() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [users, setUsers] = useState(usersData);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );
    let navigate = useNavigate();
    const openChat = (user) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.name === user.name ? { ...u, unread: 0 } : u
            )
        );

        navigate("/chat/" + user.name);
    };

    return (
        <div className="h-155 max-w-md mx-auto bg-gray-900 text-white shadow-lg overflow-hidden relative">
                           <h1 className='text-4xl px-13 font-bold font-serif border-b border-gray-600 text-purple-500 text-center bg-gray-900'>I Chat You</h1>

            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <p className="text-lg font-semibold">Messages</p>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (searchOpen) setSearchText("");
                            setSearchOpen(!searchOpen);
                        }}
                        className="border border-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                    >
                        {searchOpen ? <IoClose size={16} /> : <FiSearch size={14} />}
                    </button>

                    <button
                        onClick={() => setShowSettings(true)}
                        className="border border-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                    >
                        <VscKebabVertical size={18} />
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div
                className={`px-4 overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 mt-3" : "max-h-0"
                    }`}
            >
                <input
                    type="text"
                    placeholder="Search user..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm outline-none"
                />
            </div>

            {/* User List */}
            <div className="mt-3 overflow-y-auto h-full hide-scrollbar bg-gray-800 rounded-t-3xl">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => openChat(user)}

                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition"
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${user.online ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{user.name}</p>
                                <span className="text-xs text-gray-400">{user.time}</span>
                            </div>

                            <p className="text-sm text-gray-400 truncate">
                                {user.lastMessage}
                            </p>
                        </div>

                        {/* Unread Badge */}
                        {user.unread > 0 && (
                            <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                                {user.unread}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Settings Modal */}
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
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-red-400">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
