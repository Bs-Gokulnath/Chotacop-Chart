import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const CHAPTERS = [
  "Agra", "Ahmedabad", "Ajmer", "Amaravati", "Balasore", "Bengaluru", "Bhopal", "Bhavnagar", "Bhubaneswar",
  "Chandigarh", "Chennai", "Chhatrapati Sambhajinagar", "Coimbatore", "Dehradun", "Delhi", "Dindigul", "Durg",
  "Erode", "Goa", "Gurugram", "Guwahati", "Gwalior", "Hosur", "Hubballi", "Hyderabad", "Indore", "Jaipur",
  "Jabalpur", "Jamshedpur", "Kanpur", "Karur", "Kochi", "Kolkata", "Kota", "Kozhikode", "Lucknow", "Madurai",
  "Mangaluru", "Mumbai", "Mysuru", "Nagaland", "Nagpur", "Nashik", "Noida", "Puducherry", "Pune", "Raipur",
  "Rajkot", "Ranchi", "Salem", "Sikkim", "Siliguri", "Sivakasi", "Surat", "Thoothukudi", "Tirupur", "Tirupati",
  "Trichy", "Trivandrum", "Vadodara", "Varanasi", "Vellore", "Vizag"
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [chapter, setChapter] = useState("");
  const [otp, setOtp] = useState(["", "", ""]); // 3-digit OTP
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [generatedOtp, setGeneratedOtp] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const generateRandomOtp = () => {
    return Math.floor(100 + Math.random() * 900).toString(); // 3-digit OTP
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email || !chapter) return alert("Please fill all fields.");
    try {
      const otpToSend = generateRandomOtp();
      setGeneratedOtp(otpToSend);
      console.log("Generated OTP (for dev):", otpToSend);
      await axios.post(
        "http://148.135.137.228:5001/send-otp",
        { email, otp: otpToSend },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP: " + (err.response?.data?.detail || err.message));
    }
  };

  const verifyOtpAndSignup = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 3) return alert("Enter the complete 3-digit OTP");
    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP. Please try again.");
      setOtp(["", "", ""]);
      inputsRef.current[0]?.focus();
      return;
    }

    try {
      const response = await axios.post(
        "http://148.135.137.228:5001/signup",
        { email, chapter_name: chapter },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Signup successful!");
        setEmail("");
        setChapter("");
        setOtp(["", "", ""]);
        setStep("form");
        setGeneratedOtp("");
        navigate("/signin");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="bg-[#fdf5eb] min-h-screen">
      <Header />
      <div className="flex items-center justify-center px-4 py-10 mt-[48px]">
        <form
          onSubmit={step === "form" ? sendOtp : verifyOtpAndSignup}
          className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-[-20px]">Sign Up</h2>

          {step === "form" && (
            <>
              <div className="mt-[-20px]">
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Chapter Name</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  required
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Chapter</option>
                  {CHAPTERS.map((ch) => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === "otp" && (
            <div>
              <label className="block text-gray-700 mb-2">Enter 3-Digit OTP</label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="w-16 h-16 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            {step === "form" ? "Send OTP" : "Verify & Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
