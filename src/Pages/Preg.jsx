import React, { useState } from 'react';
import signup from '../assets/images/signup.gif';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';  

const Preg = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //form submmision
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, number, age, gender, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { position: 'top-center' });
      return;
    }

    try {
      // Fetch all existing users to determine the next available user number
      const userCollectionRef = collection(firestore, 'Users');
      const userSnapshot = await getDocs(userCollectionRef);
      const userCount = userSnapshot.size;

      // Create the user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assign the new user a role based on the user count 
      const userRole = `User${userCount + 1}`;

      // Hash the password before storing it in Firestore
      const hashedPassword = await bcrypt.hash(password, 10);  

      // Add the user's data to Firestore
      if (user) {
        await setDoc(doc(firestore, 'Users', user.uid), {
          name,
          email,
          number,
          age,
          gender,
          password: hashedPassword, 
          role: userRole,
          userId: user.uid,
        });
        console.log(`User registered successfully with role: ${userRole}`);
        toast.success('User registered successfully', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
      toast.error(error.message, { position: 'bottom-center' });
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="hidden lg:block bg-[#0067ff] rounded-lg">
            <figure className="rounded-lg">
              <img src={signup} alt="signup" className="w-full rounded-lg" />
            </figure>
          </div>

          <div className="rounded-lg lg:pl-16">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 text-3xl">
              Create an <span className="text-primaryColor">account</span>
            </h3>

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                className="w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-sm h-10 font-black px-4 shadow-lg"
              >
                Patient
              </button>
              <Link to="/dreg">
                <button
                  type="button"
                  className="w-64 bg-white text-black text-[18px] leading-[30px] rounded-sm h-10 font-black px-4 shadow-lg"
                >
                  Doctor
                </button>
              </Link>
            </div>

            <form className="py-4 md:py-0" onSubmit={handleRegister}>
              <div className="mb-5 mt-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  className="w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5 mt-2">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5 mt-2">
                <input
                  type="number"
                  placeholder="Phone Number"
                  name="number"
                  className="w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="mb-5 mt-2 md:flex-1">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    className="w-full h-12 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                    required
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-5 mt-2 md:flex-1">
                  <select
                    name="gender"
                    className="w-full h-12 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="mb-5 mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5 mt-2">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  className="w-full h-10 px-4 py-3 border border-black/opacity-50 text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <label className="flex items-center text-black font-bold cursor-pointer">
                <input type="checkbox" className="mr-2 h-5 w-5 cursor-pointer" required />
                I agree to the <span className="underline ml-2">Terms and Conditions</span>
              </label>

              <div className="mt-5">
                <button type="submit" className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg h-12 font-black px-4 py-2 hover:bg-blue-600">
                  Register
                </button>
              </div>
              <p className="mt-5 text-black text-center">
                Already have an account? <Link to="/login" className="text-black font-black">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preg;
