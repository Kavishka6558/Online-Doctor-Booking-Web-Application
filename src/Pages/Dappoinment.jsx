import React, { useState, useEffect } from 'react'; 
import { auth, firestore } from '../firebase'; 
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom'; 
import drImage from '../assets/images/dr.jpeg'; 

const Dappointments = () => {
  const [userDetails, setUserDetails] = useState(null); 
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  // Function to fetch user details and related appointments from Firestore
  const fetchUserDataAndAppointments = async () => {
    const user = auth.currentUser; 
    if (user) {
      try {
        // Fetch doctor details from the 'Doctors' collection using the user's UID
        const docRef = doc(firestore, 'Doctors', user.uid);
        const docSnap = await getDoc(docRef); 
        if (docSnap.exists()) {
          setUserDetails(docSnap.data()); // Set doctor details in state

          // Fetch all appointments from 'Bookings' collection where doctorId matches the logged-in doctor's UID
          const bookingsRef = collection(firestore, 'Bookings'); 
          const appointmentQuery = query(bookingsRef, where('doctorId', '==', user.uid)); 
          const querySnapshot = await getDocs(appointmentQuery); 

          // Map through the fetched appointment documents and add them to appointments state
          const fetchedAppointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAppointments(fetchedAppointments); 
        } else {
          console.log('No such document!'); 
        }
      } catch (error) {
        console.error('Error fetching data:', error.message); 
      } finally {
        setLoading(false); 
      }
    }
  };

  useEffect(() => {
    fetchUserDataAndAppointments(); 
  }, []); 

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message); // Catch and log any errors during logout
    }
  };

  // If data is still loading, display a loading message
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If no user details are found, show a message
  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No user details found.</p>
      </div>
    );
  }

  // Main component render
  return (
    <div className="flex h-screen p-6">
      {/* Profile Section */}
      <div className="w-80 bg-white p-6 rounded-lg border border-gray-300 ml-52 h-[800px] mt-10">
        <div className="flex flex-col items-center">
          <img
            src={drImage} 
            alt="Doctor Profile"
            className="w-24 h-24 rounded-full mb-4" 
          />
          <h2 className="text-lg font-semibold">
            Dr. {userDetails.name || 'Name not provided'}
          </h2>
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
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md font-bold shadow-xl">
            Appointment 
          </button>
          <Link to="/dsettings">
            <button className="px-4 py-2 bg-white text-black rounded-md font-bold shadow-xl hover:bg-blue-600">
              Settings 
            </button>
          </Link>
        </div>

        {/* Appointments List */}
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-black mb-5 -mt-5">My Appointments</h3> {/* Appointments heading */}

          {/* If appointments exist, map over the list and display each appointment */}
          {appointments.length > 0 ? (
            appointments.map((booking, index) => (
              <div key={index} className="flex items-center border border-gray-300 h-60 rounded-lg mb-4">
                <div className="ml-6">
                  <p className="text-lg text-gray-600 font-black">
                    Patient: {booking.userName || 'Not Available'} 
                  </p>
                  <p className="text-lg text-gray-600 font-black">
                    Hospital: {booking.hospital || 'Not Available'} 
                  </p>
                  <p className="text-lg text-gray-600 font-black">
                    Day: {booking.day || 'Not Available'} 
                  </p>
                  <p className="text-lg text-gray-600 font-black">
                    Time: {booking.time || 'Not Available'} 
                  </p>
                  <div className="mt-4 space-x-4">
                    <Link to="/chat">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold w-full">
                        Chat 
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No appointments found.</p> 
          )}
        </div>
      </div>
    </div>
  );
};

export default Dappointments; 
