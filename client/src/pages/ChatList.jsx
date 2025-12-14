import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]);
  const me = localStorage.getItem("username");
  const navigate = useNavigate();

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

  return (
    <div className="h-screen bg-gray-900 text-white">
      <h2 className="p-4 font-bold text-lg">Chats</h2>

      {users.map((u) => (
        <div
          key={u}
          onClick={() => navigate(`/chat/${me}/${u}`)}
          className="p-4 border-b border-gray-700 flex justify-between cursor-pointer"
        >
          <span>{u}</span>
          <span
            className={`w-3 h-3 rounded-full ${
              online.includes(u) ? "bg-green-500" : "bg-gray-500"
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatList;
