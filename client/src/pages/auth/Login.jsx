import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/ContextApi/ChatContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = ChatState();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = login;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        description: "Login successfully.",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat");
    } catch (err) {
      console.log(err);
      toast({
        description: "Email or Password is incorrect",
      });
    }
  };
  return (
    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 ">
      <div className="space-y-1 ">
        <Input
          type="email"
          name="email"
          required
          id="email"
          placeholder="Enter your email"
          value={login.email}
          onChange={handleLoginChange}
        />
      </div>
      <div className="space-y-1 relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          id="password"
          placeholder="Password"
          value={login.password}
          onChange={handleLoginChange}
        />
        <span
          className="absolute right-2 top-1 text-slate-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};


export default Login;
