import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import DotPattern from "@/components/magicui/dot-pattern";
import Login from "./Login"; // Import Login Component
import Signup from "./Signup"; // Import Signup Component

const Auth = () => {
  return (
    <div className="flex justify-center items-center  px-4 sm:px-6 lg:px-8 font-playpen ">
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

      <div className="z-10 relative h-[80vh] w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl border overflow-hidden bg-background border-white shadow-lg flex justify-center rounded-lg mt-10">
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
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 text-lg text-green-700 p-6 sm:p-8 lg:p-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ">
            Welcome to ChatNow
          </h1>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="flex justify-center gap-2 sm:gap-4 mb-4">
              <TabsTrigger
                value="login"
                className="border-b-2 data-[state=active]:border-b-purple-500 transition-all duration-300 rounded-xl px-6 sm:px-8"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="border-b-2  data-[state=active]:border-b-purple-500 transition-all duration-300  rounded-xl px-6 sm:px-8"
              >
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login /> {/* Render Login Component */}
            </TabsContent>
            <TabsContent value="signup">
              <Signup /> {/* Render Signup Component */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
