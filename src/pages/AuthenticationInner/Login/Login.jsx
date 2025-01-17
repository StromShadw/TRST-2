import { useState } from "react";
import axios from "axios";
import { useGlobalState } from "../../Context/GlobalState";
import Logo from "../../assets/Logo_Transparent.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const Login = () => {
  const {
    setIsAuthenticated,
    setAvatar,
    setUser,
    token: [, setToken],
  } = useGlobalState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("Login response data:", response.data); // Debugging API response

      const { user, accessToken, refreshToken } = response.data.data;

      console.log(user);

      // Save tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Setting the cookies
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      // Update global state
      localStorage.setItem("userName", user.username);
      setUser(user.username);
      console.log("User set to:", user.username);

      localStorage.setItem("avatar", user.avatar);
      setAvatar(user.avatar);
      console.log("Avatar set to:", user.avatar);

      setIsAuthenticated(true);
      console.log("Authentication status set to true.");

      setToken(accessToken);
      console.log("Access token set in global state.");

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error.response || error.message || error);
      toast.error(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-orange-400">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-[#8C52FF]">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" width={100} />
        </div>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your credentials to access your account
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF914D]"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF914D]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            } text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-600`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
