import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { AiOutlineInstagram, AiOutlineFacebook, AiOutlineLinkedin, AiOutlineTwitter } from 'react-icons/ai';

const quicklinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/search",
    display: "Search",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full h-auto bg-gradient-to-r from-sky-500 to-sky-800 py-8 text-white">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="flex flex-col items-center lg:items-start">
          <img src={logo} alt="Medix Logo" className="w-36 mb-4" />
          <p className="text-base font-extrabold">info@medix.com</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 mt-8 lg:mt-0">
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold mb-4">Quick Links</h1>
            {quicklinks.map((link, index) => (
              <Link key={index} to={link.path} className="text-base font-medium mb-2">
                {link.display}
              </Link>
            ))}
            <Link to="/reviews" className="text-base font-medium mb-2">Reviews</Link>
            <Link to="/services" className="text-base font-medium mb-2">Services</Link>
            <Link to="/specialists" className="text-base font-medium mb-2">Specialists</Link>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold mb-4">I want to :</h1>
            <Link to="/search" className="text-base font-medium mb-2">Search a doctor</Link>
            <Link to="/login" className="text-base font-medium mb-2">Login</Link>
            <Link to="/register" className="text-base font-medium mb-2">Register</Link>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold mb-4">Support</h1>
            <Link to="/contact" className="text-base font-medium mb-2">Contact</Link>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-white mt-8"></div>

      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center mt-4">
        <div className="flex space-x-4">
          <AiOutlineFacebook className="text-2xl" />
          <AiOutlineInstagram className="text-2xl" />
          <AiOutlineLinkedin className="text-2xl" />
          <AiOutlineTwitter className="text-2xl" />
        </div>
        <p className="text-base font-light mt-4 lg:mt-0">© {year} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
