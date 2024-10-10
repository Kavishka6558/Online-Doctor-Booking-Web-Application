import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Bookdone = () => {

  return (
    <section className="flex flex-col items-center justify-center h-screen text-center">
        <FontAwesomeIcon icon={faCircleCheck} className="text-[#0081fb] text-6xl mb-4" />
        <h1 className="text-black text-[32px] font-bold">Booking Done!</h1>
        <h1 className="text-black text-xl font-extralight mt-4">Thank you for choosing us</h1>
        <h1 className="text-black text-xl font-semibold mt-4">Have a great day!</h1>
        <Link to="/pprofile">
        <button className="w-[292px] h-[52px] px-6 py-3.5 bg-[#0081fb] rounded-lg shadow flex justify-center items-center gap-2 mt-6">
            <h1 className="text-white text-base font-medium leading-normal">Go back to profile</h1>
        </button>
        </Link>
        
  </section>
  );
};

export default Bookdone;
