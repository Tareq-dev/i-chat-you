import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={submit} className="bg-gray-800 p-6 rounded w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">Register</h2>

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

        <button className="w-full bg-purple-600 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
