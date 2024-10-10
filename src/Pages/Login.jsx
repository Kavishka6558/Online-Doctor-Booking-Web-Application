import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in:', user.uid);

      // Check if the user exists in the "Users" collection
      let userDoc = await getDoc(doc(firestore, 'Users', user.uid));

      if (userDoc.exists()) {
        console.log('User data found in Users collection');
        navigate('/pprofile'); 
      } else {
       
        userDoc = await getDoc(doc(firestore, 'Doctors', user.uid));

        if (userDoc.exists()) {
          console.log('User data found in Doctors collection');
          navigate('/dprofile'); 
        } else {
          console.error('User data not found in either Users or Doctors collection');
          toast.error('User data not found', { position: 'top-center' });
        }
      }

      toast.success('User logged in successfully', { position: 'top-center' });
    } catch (error) {
      console.error('Error during login:', error.message);
      toast.error(error.message, { position: 'bottom-center' });
    }
  };

  return (
    <section className='px-5 lg:px-0'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-lg md:p-10'>
        <h3 className='text-headingColor text-[22px] leading-9 font-black mb-10'>
          Hello!<span className='text-[#0081FB]'> Welcome</span> Back
        </h3>
        <form className='py-4 md:py-0' onSubmit={handleSubmit}>
          <div className='mb-5'>
            <input
              className='w-full px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              type='email'
              placeholder='Enter your email'
              name='email'
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='mb-5'>
            <input
              className='w-full px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              type='password'
              placeholder='Enter your password'
              name='password'
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='flex items-center justify-between mt-2 mb-6'>
            <label className='flex items-center text-black cursor-pointer'>
              <input type='checkbox' className='mr-2 h-5 w-5 cursor-pointer' />
              Remember me
            </label>
            <h1 className='text-black cursor-pointer underline'>Forgot password</h1>
          </div>
          <div className='mt-7'>
            <button
              type='submit'
              className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg h-12 font-black px-4 py-2 hover:bg-blue-600'
            >
              Login
            </button>
          </div>
          <p className='mt-5 text-black text-center'>
            Don't have an account?{' '}
            <Link to='/preg' className='text-black font-black'>
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
