import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/images/logo.png';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { auth, firestore } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const navLinks = [
  { path: '/home', display: 'Home' },
  { path: '/search', display: 'Search' },
];

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState(null);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate(); 

  const handleStickyHeader = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add('sticky__header');
    } else {
      headerRef.current.classList.remove('sticky__header');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleStickyHeader);
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Try to get the user from the Doctors collection
        let userDoc = await getDoc(doc(firestore, 'Doctors', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name);
          setUserType('doctor'); 
        } else {
          // If not found in Doctors, try the Users collection
          userDoc = await getDoc(doc(firestore, 'Users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name);
            setUserType('user'); 
          }
        }
      } else {
        // User is signed out
        setUserName(null);
        setUserType(null); 
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Handle click on the user name
  const handleUserClick = () => {
    if (userType === 'doctor') {
      navigate('/dprofile'); 
    } else if (userType === 'user') {
      navigate('/pprofile'); 
    }
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="Site Logo" />
          </div>

          <div className="navigation" ref={menuRef}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => {
                // Conditionally render based on userType
                if (userType === 'doctor' && link.display !== 'Home') {
                  return null; 
                }
                return (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? 'text-primaryColor text-[16px] leading-7 font-[600]'
                          : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                      }
                    >
                      {link.display}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {userName ? (
              <span
                className="text-black py-2 px-6 font-black h-[44px] flex items-center justify-center rounded-[50px] shadow-lg cursor-pointer"
                onClick={handleUserClick} 
              >
                {userName}
              </span>
            ) : (
              <Link to="/login">
                <button className="bg-white text-black py-2 px-6 font-black h-[44px] flex items-center justify-center rounded-[50px] shadow-lg">
                  Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
