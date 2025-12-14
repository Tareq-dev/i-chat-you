import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);

    navigate("/chats");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={submit} className="bg-gray-800 p-6 rounded w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          placeholder="Username"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-green-600 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
