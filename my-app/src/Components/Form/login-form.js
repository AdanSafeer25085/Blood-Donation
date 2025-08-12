import { useState } from "react";
import API_BASE_URL from '../../config/api';

function LoginForm({ onLoginSuccess, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        onLoginSuccess(result.user);
      } else {
        setMessage(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4 text-center">Login to Your Account</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="login-email">
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
            className="w-full px-3 py-2 border-2 border-[#b20e0e] rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="login-password">
            Password
          </label>
          <input
            type="password"
            id="login-password"
            className="w-full px-3 py-2 border-2 border-[#b20e0e] rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#b20e0e] text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {message}
          </div>
        )}
        
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;