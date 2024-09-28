// For future use (under development)
import React from 'react'
import { MessageCircle, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-100 to-white">
          {/* <p className="text-3xl ">Click on a user to start chatting</p> */}
          <div className="mx-auto px-4 flex flex-col items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl  font-bold mb-6">Connect Instantly with Friends and Family</h1>
              <p className="text-xl mb-8">Experience seamless communication with our real-time chat application.</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100">
              Click on a user to start chatting
              </Button>
            </div>

          </div>

          <div className=" mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
                <p>Instant message delivery for smooth conversations.</p>
              </div>
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Group Chats</h3>
                <p>Create and manage group conversations effortlessly.</p>
              </div>
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">File Sharing</h3>
                <p>Share documents, images, and more with ease.</p>
              </div>
            </div>
          </div>
         
        </div>
  )
}

export default Home
