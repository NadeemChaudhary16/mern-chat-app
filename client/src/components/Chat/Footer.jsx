import React from 'react';
import { Button } from "@/components/ui/button";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-2">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 mb-2 sm:mb-0">
          © 2024 ChatNow. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link to="https://github.com/NadeemChaudhary16/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" aria-label="GitHub" className="hover:text-gray-900 hover:scale-110 transition-transform duration-200">
              <FiGithub size={20}/>
            </Button>
          </Link>
          <Link to="https://www.linkedin.com/in/nadeemchaudhary/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" aria-label="LinkedIn" className="hover:text-blue-600 hover:scale-110 transition-transform duration-200">
              <FaLinkedinIn size={20}/>
            </Button>
          </Link>
          <Link to="https://x.com/NadeemCh100/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" aria-label="Twitter" className="hover:text-blue-500 hover:scale-110 transition-transform duration-200">
              <FaXTwitter size={20} />
            </Button>
          </Link>
          <Link to="https://www.instagram.com/nadeemchaudhary16" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" aria-label="Instagram" className="hover:text-pink-500 hover:scale-110 transition-transform duration-200">
              <FaInstagram size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
