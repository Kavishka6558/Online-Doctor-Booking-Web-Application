import React, { useState } from 'react';
import signup from '../assets/images/signup.gif';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs'; 

const Dreg = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    hospital: '',
    medlicenno: '',
    password: '',
    cpassword: '',
    specialty: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, number, hospital, medlicenno, password, cpassword, specialty } = formData;

    if (password !== cpassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      const doctorCollectionRef = collection(firestore, "Doctors");
      const doctorSnapshot = await getDocs(doctorCollectionRef);
      const doctorCount = doctorSnapshot.size; 

      // Create user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const doctorRole = `Doctor ${doctorCount + 1}`;

      if (user) {
        // Save user data with hashed password in Firestore
        await setDoc(doc(firestore, "Doctors", user.uid), {
          name,
          email,
          number,
          hospital,
          medlicenno,
          specialty,
          password: hashedPassword, 
          role: doctorRole, 
          userId: user.uid, 
        });

        
        await setDoc(doc(firestore, "Search", user.uid), {
          name,
          hospital,
          specialty,
          medlicenno,
          role: doctorRole, 
        });

        console.log(`User registered successfully with role: ${doctorRole}`);
        toast.success("User registered successfully", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <section className='px-5 xl:px-0'>
      <div className='max-w-[1170px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='hidden lg:block bg-[#0067ff] rounded-lg'>
            <figure className='rounded-lg mt-20'>
              <img src={signup} alt='signupimg' className='w-full rounded-lg' />
            </figure>
          </div>

          <div className='rounded-lg lg:pl-16'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 text-3xl'>
              Create an <span className='text-primaryColor'>account</span>
            </h3>

            <div className='mt-5 flex justify-between'>
              <Link to='/preg'>
                <button type='button' className='w-64 bg-white text-black text-[18px] leading-[30px] rounded-sm h-10 font-black px-4 shadow-lg'>
                  Patient
                </button>
              </Link>
              <button type='button' className='w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-sm h-10 font-black px-4 shadow-lg'>
                Doctor
              </button>
            </div>

            <form className='py-4 md:py-0' onSubmit={handleRegister}>
              <div className='mb-5 mt-4'>
                <input
                  type='text'
                  placeholder='Full Name'
                  name='name'
                  className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-5 mt-2'>
                <input
                  type='email'
                  placeholder='Email'
                  name='email'
                  className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-5 mt-2'>
                <input
                  type='number'
                  placeholder='Phone Number'
                  name='number'
                  className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>

              <div className='mb-5 mt-2'>
                <input
                  type='text'
                  placeholder='Hospital'
                  name='hospital'
                  className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </div>

              <div className='mb-5 mt-2'>
                <input
                  type='number'
                  placeholder='Medical License Number'
                  name='medlicenno'
                  className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.medlicenno}
                  onChange={handleChange}
                />
              </div>

              <div className='flex flex-col md:flex-row md:space-x-4'>
                <div className='mb-5 mt-2 md:flex-1'>
                  <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className='mb-5 mt-2 md:flex-1'>
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    name='cpassword'
                    className='w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                    required
                    value={formData.cpassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='mb-5 mt-2'>
                <select
                  name='specialty'
                  className='w-full h-12 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  <option value='' disabled>Medical Specialty</option>
                  <option value='Cardiologist'>Cardiologist</option>
                  <option value='Dermatologist'>Dermatologist</option>
                  <option value='Neurosurgeon'>Neurosurgeon</option>
                  <option value='Psychiatrist'>Psychiatrist</option>
                  <option value='Neurologist'>Neurologist</option>
                  <option value='Endocrinologist'>Endocrinologist</option>
                </select>
              </div>

              <label className="flex items-center text-black font-bold cursor-pointer">
                <input type="checkbox" className="mr-2 h-5 w-5 cursor-pointer" required />
                I agree to the <span className='underline ml-2'>Terms and Conditions</span>
              </label>

              <div className='mt-5'>
                <button type='submit' className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg h-12 font-black px-4 py-2 hover:bg-blue-600'>
                  Register
                </button>
              </div>

              <p className='mt-5 text-black text-center'>
                Already have an account? <Link to='/login' className='text-black font-black'>Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dreg;
