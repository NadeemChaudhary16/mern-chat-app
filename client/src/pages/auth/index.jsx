import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import DotPattern from "@/components/magicui/dot-pattern";
import { useToast } from "@/components/ui/use-toast"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/ContextApi/ChatContext";


const Auth = () => {
  const navigate=useNavigate()
  const { toast } = useToast()
  const{setUser}=ChatState();
  
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // login
  const [showPassword, setShowPassword] = useState(false);

  // signup
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prevState) => ({ ...prevState, [name]: value }));
    console.log(value);
  };


  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignup((prevState) => ({ ...prevState, [name]: value }));
    console.log(value);
  };

  const handleLoginSubmit =async(e) => {
    const {email, password}= login
    e.preventDefault();
    try{
      const config={
        headers:{
          "Content-Type": "application/json",

        }
      };
      
      const {data}=await axios.post("/api/user/login",{
        email, password
      },config
    )
       console.log("login data:", data);
      toast({
        description: "Login successfully.",
      })
      setUser(data)
      localStorage.setItem("userInfo",JSON.stringify(data))
      navigate("/chat")
    } catch(err){
      console.log(err)
      toast({
        description: "Something went wrong",

      })
    }
  };

  const handleSignupSubmit = async(e) => {
    const {name, email, password,confirmPassword}= signup
    e.preventDefault()

    if(password !== confirmPassword){
       toast({
      description: "Password and confirm password do not match.",  
    })
    return
    }

    try{
      const config={
        headers:{
          "Content-Type": "application/json",

        }
      };
      
      const {data}=await axios.post("/api/user/register",{
        name,email,password,confirmPassword
      },config
    )
      console.log("registration data:", data);
      toast({
        description: "Registered successfully.",
      })

      localStorage.setItem("userInfo",JSON.stringify(data))
      navigate("/chat")
    } catch (err) {
  console.log("Error:", err);
  toast({
    description: "Something went wrong",
  });
}

  }

  return (
    <div className="flex justify-center ">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,white)] "
        )}
      />

      <div className="z-10 relative h-[80vh] w-[50vw] border overflow-hidden bg-background border-white shadow-lg flex justify-center  mt-10 rounded-lg">
        <AnimatedGridPattern
          numSquadata={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
        <div className="flex flex-col gap-10 text-lg text-green-700">
          {" "}
          Welcome to Chat App
          <Tabs defaultValue="login" className="h-full w-[400px]">
            <TabsList className="flex gap-4">
              <TabsTrigger
                value="login"
                className="border-b-2   data-[state=active]:border-b-purple-500 transition-all duration-300 rounded-xl px-8"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="border-b-2  data-[state=active]:border-b-purple-500 transition-all duration-300 rounded-xl px-8"
              >
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form
                action=""
                onSubmit={handleLoginSubmit}
                className="flex flex-col gap-4"
              >
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
            </TabsContent>
         {/* Signup  */}
            <TabsContent value="signup" className="mt-4">
              <form
                action=""
                onSubmit={handleSignupSubmit}
                className="flex flex-col gap-4"
              >
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
                    id="name"
                    value={signup.email}
                    placeholder="Enter your email"
                    onChange={handleSignupChange}
                  />
                </div>
                <div className="space-y-1 relative">
                  <Input
                    type={showCreatePass ? "text": "password"}
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
                    type={showConfirmPass ? "text": "password"}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
