import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignup((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = signup;

    if (password !== confirmPassword) {
      toast({
        description: "Password and confirm password do not match.",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/register",
        { name, email, password, confirmPassword },
        config
      );
      toast({
        description: "Registered successfully.",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat");
    } catch (err) {
      console.log("Error:", err);
      toast({
        description: "Something went wrong",
      });
    }
  };

  return (
    <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <Input
          type="text"
          name="name"
          required
          id="name"
          value={signup.name}
          placeholder="Enter your name"
          onChange={handleSignupChange}
        />
      </div>
      <div className="space-y-1">
        <Input
          type="email"
          name="email"
          required
          id="email"
          value={signup.email}
          placeholder="Enter your email"
          onChange={handleSignupChange}
        />
      </div>
      <div className="space-y-1 relative">
        <Input
          type={showCreatePass ? "text" : "password"}
          name="password"
          required
          id="password"
          value={signup.password}
          placeholder="Password"
          onChange={handleSignupChange}
        />
        <span
          className="absolute right-2 top-1 text-slate-500"
          onClick={() => setShowCreatePass(!showCreatePass)}
        >
          {showCreatePass ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
      </div>
      <div className="space-y-1 relative">
        <Input
          type={showConfirmPass ? "text" : "password"}
          name="confirmPassword"
          required
          id="confirm_password"
          value={signup.confirmPassword}
          placeholder="Confirm your password"
          onChange={handleSignupChange}
        />
        <span
          className="absolute right-2 top-1 text-slate-500"
          onClick={() => setShowConfirmPass(!showConfirmPass)}
        >
          {showConfirmPass ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
      </div>
      <Button type="submit">Signup</Button>
    </form>
  );
};

export default Signup;
