import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import { useNavigate } from "react-router";

const ChatList = () => {

  const myId = localStorage.getItem("userId");
  const [chats, setChats] = useState([]);
  const [online, setOnline] = useState([]);
  const me = localStorage.getItem("username");
  const navigate = useNavigate();

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
  useEffect(() => {
    socket.emit("join", me);

    socket.on("onlineUsers", (list) => {
      setOnline(list);
    });

    return () => socket.off("onlineUsers");
  }, [me]);

  useEffect(() => {
    API.get(`/chats/${me}`).then((res) => {
      setUsers(res.data);
    });
  }, [me]);

  console.log(chats)
  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen text-white">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-700">
        Chats
      </h2>

      {chats.map((c) => {
        // 🔥 receiver বের করা
        const receiver = c.participants.find(
          (u) => u._id !== myId
        );

        return (
          <div
            key={c._id}
            onClick={() => navigate(`/chat/${c._id}`)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800"
          >
            <div>
              <p className="font-semibold">
                {receiver?.username}
              </p>
              <p className="text-sm text-gray-400 truncate max-w-[200px]">
                {c.lastMessage || "No messages yet"}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              {new Date(c.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
