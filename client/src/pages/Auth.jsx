import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
  
      const res = await API.post(url, form);
      // only login returns token
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);   // 🔥 ADD THIS
        localStorage.setItem("username", res.data.username);
        navigate("/");
      } else {
        alert("Register successful. Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={submit}
        className="bg-gray-800 p-6 rounded w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          placeholder="Username"
          className="w-full p-2 bg-gray-700 rounded outline-none"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-700 rounded outline-none"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className={`w-full py-2 rounded ${isLogin ? "bg-green-600" : "bg-purple-600"
            }`}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-sm text-center text-gray-400 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "No account? Register here"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

export default Auth;
