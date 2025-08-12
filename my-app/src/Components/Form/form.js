import { useState, useEffect } from "react";
import LoginForm from "./login-form";
import UserDetails from "./LoginUserDetails";

function ExampleV2({ onClose }) {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Login-related states
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    
    if (savedUser && savedToken) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^(\+92|0)?3[0-9]{9}$/.test(mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber =
        "Mobile number must be a valid Pakistani number (e.g., 03001234567)";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!bloodGroup) newErrors.bloodGroup = "Blood group is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch("http://localhost:5000/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            mobileNumber,
            email,
            password,
            location,
            bloodGroup,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage("Registration successful! You can now login.");
          // Clear form
          setFirstName("");
          setLastName("");
          setMobileNumber("");
          setEmail("");
          setPassword("");
          setLocation("");
          setBloodGroup("");
          setErrors({});
          
          // Show login form after 2 seconds
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage("");
          }, 2000);
        } else {
          // Handle specific error messages from backend
          if (data.error) {
            if (data.error.includes("already exists")) {
              setErrors({ email: "This email is already registered. Please login." });
            } else {
              alert(data.error);
            }
          } else {
            alert("Failed to save data. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setShowLoginForm(false);
    setIsLogin(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <section className="bg-white rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-xl p-4 md:p-6 lg:p-10 relative m-5">
        <div className="container h-[90vh] overflow-y-auto">
          <div className="text-center">
            <img
              className="mx-auto w-24 md:w-32 lg:w-48 rounded-full"
              src="./image/logo.png"
              alt="logo"
            />
            <h4 className="mb-6 mt-2 text-black text-lg md:text-xl lg:text-2xl font-semibold">
              Heart To Heart
            </h4>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {/* Show UserDetails if logged in */}
          {loggedInUser ? (
            <UserDetails user={loggedInUser} onLogout={handleLogout} />
          ) : isLogin || showLoginForm ? (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onClose={() => {
                setShowLoginForm(false);
                setIsLogin(false);
              }}
              onSwitchToRegister={() => {
                setIsLogin(false);
                setShowLoginForm(false);
              }}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row md:gap-4">
                <div className="w-full md:w-1/2 mb-4">
                  <label className="block text-sm md:text-base mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full p-2 border-2 rounded-lg text-black ${
                      errors.firstName ? "border-red-500" : "border-[#b20e0e]"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="w-full md:w-1/2 mb-4">
                  <label className="block text-sm md:text-base mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full p-2 border-2 rounded-lg text-black ${
                      errors.lastName ? "border-red-500" : "border-[#b20e0e]"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm md:text-base mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="03001234567"
                  className={`w-full p-2 border-2 rounded-lg text-black ${
                    errors.mobileNumber ? "border-red-500" : "border-[#b20e0e]"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm md:text-base mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className={`w-full p-2 border-2 rounded-lg text-black ${
                    errors.location ? "border-red-500" : "border-[#b20e0e]"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm md:text-base mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className={`w-full p-2 border-2 rounded-lg text-black ${
                    errors.bloodGroup ? "border-red-500" : "border-[#b20e0e]"
                  }`}
                >
                  <option value="">Select a blood group</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm md:text-base mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                  className={`w-full p-2 border-2 rounded-lg text-black ${
                    errors.email ? "border-red-500" : isValid ? "border-[#b20e0e]" : "border-red-500"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                {!isValid && !errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm md:text-base mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full p-2 border-2 rounded-lg text-black ${
                    errors.password ? "border-red-500" : "border-[#b20e0e]"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 px-4 py-2 bg-[#b20e0e] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </button>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm">Already have an account?</p>
                <button
                  type="button"
                  className="px-4 py-2 text-red-500 border-2 border-red-500 rounded-lg hover:bg-red-100"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </div>
            </form>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      </section>
    </div>
  );
}

export default ExampleV2;