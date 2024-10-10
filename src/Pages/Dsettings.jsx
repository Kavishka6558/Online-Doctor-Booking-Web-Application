import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import drImage from '../assets/images/dr.jpeg';

const Dsettings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [dropdownVisibility, setDropdownVisibility] = useState({
    Monday: true,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(firestore, 'Doctors', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);
          setSelectedTimeSlots(userData.timeslots || selectedTimeSlots);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = './login';
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };


  const handleTimeSlotChange = (day, slot) => {
    setSelectedTimeSlots((prevSlots) => ({
      ...prevSlots,
      [day]: prevSlots[day].includes(slot)
        ? prevSlots[day].filter((s) => s !== slot)
        : [...prevSlots[day], slot],
    }));
  };

  const toggleDropdown = (day) => {
    setDropdownVisibility((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const timeslotData = {
          doctorId: user.uid,
          role: userDetails.role || 'Not specified',
          timeslots: selectedTimeSlots,
          qualification: selectedQualification,
          phoneNumber: phoneNumber,
          hospitalName: hospitalName,
        };

        await setDoc(doc(firestore, 'Timeslots', user.uid), timeslotData);

        alert('Time slots and details saved successfully.');
      } catch (error) {
        console.error('Error saving time slots:', error.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No user details found.</p>
      </div>
    );
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const availableTimes = ['4.00pm', '4.30pm', '5.00pm', '5.30pm', '6.00pm', '6.30pm', '7.00pm', '7.30pm', '8.00pm'];

  return (
    <div className="flex h-screen p-6">
      {/* Profile Section */}
      <div className="w-80 bg-white p-6 rounded-lg border border-gray-300 ml-52 h-[800px] mt-10">
        <div className="flex flex-col items-center">
          <img src={drImage} alt="Doctor Profile" className="w-24 h-24 rounded-full mb-4" />
          <h2 className="text-lg font-semibold">Dr. {userDetails.name || 'Name not provided'}</h2>
        </div>
        <div className="mt-[550px]">
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 ml-10 mt-10">
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <Link to="/dprofile">
            <button className="px-4 py-2 bg-white text-black rounded-md shadow-xl font-bold hover:bg-blue-500">
              Profile
            </button>
          </Link>
          <Link to="/dappoinment">
            <button className="px-4 py-2 bg-white text-black rounded-md font-bold shadow-xl hover:bg-blue-500">
              Appointments
            </button>
          </Link>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md font-bold shadow-xl">
            Settings
          </button>
        </div>

        {/* Time Slots */}
        <label className="block mb-2 mt-6 font-black text-xl">Time slots by Day:</label>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4">
            <button
              className="font-semibold text-lg bg-blue-200 py-2 px-4 rounded-md hover:bg-blue-300 mb-2 w-[1050px] text-left"
              onClick={() => toggleDropdown(day)}
            >
              {day} {dropdownVisibility[day] ? '▼' : '►'}
            </button>
            {dropdownVisibility[day] && (
              <div className="grid grid-cols-3 gap-2 font-semibold mt-2 p-4 border bg-white rounded-lg shadow-sm w-[1050px]">
                {availableTimes.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotChange(day, slot)}
                    className={`px-4 py-2 rounded-md font-semibold text-sm cursor-pointer ${
                      selectedTimeSlots[day]?.includes(slot)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-80 mt-6 font-bold hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Dsettings;
