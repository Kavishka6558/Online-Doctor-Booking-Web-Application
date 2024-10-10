import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { getDoc, doc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import avatar2 from '../assets/images/avatar2.png';
import { Link, useNavigate } from 'react-router-dom';

const Pprofile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user details
          const docRef = doc(firestore, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());

            // Fetch bookings related only to the current user's ID
            const bookingsRef = collection(firestore, 'Bookings');
            const q = query(bookingsRef, where('userId', '==', user.uid)); 
            const bookingSnap = await getDocs(q);

            if (!bookingSnap.empty) {
              const bookings = bookingSnap.docs.map((doc) => ({
                id: doc.id, // Include document ID for deletion
                ...doc.data(),
              }));
              setBookingDetails(bookings);
            } else {
              console.log('No bookings found.');
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user or booking data:', error.message);
        }
      } else {
        console.log('User is not logged in');
        toast.error('User is not logged in', {
          position: 'bottom-center',
        });
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = './login';
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is irreversible.");

    if (confirmed && user) {
      try {
        // Delete user data from Firestore
        await deleteDoc(doc(firestore, 'Users', user.uid));

        // Delete Firebase Authentication account
        await user.delete();

        toast.success('Account deleted successfully', {
          position: 'bottom-center',
        });

        // Redirect to login page after account deletion
        window.location.href = './login';

      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          toast.error('Please log in again to delete your account.', {
            position: 'bottom-center',
          });
          console.error('Error deleting account:', error.message);
        } else {
          console.error('Error deleting account:', error.message);
          toast.error('Error deleting account. Try again later.', {
            position: 'bottom-center',
          });
        }
      }
    } else {
      // User canceled the deletion
      toast.info('Account deletion canceled.', {
        position: 'bottom-center',
      });
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");

    if (confirmed) {
      try {
        // Delete booking from Firestore
        await deleteDoc(doc(firestore, 'Bookings', bookingId));

        toast.success('Appointment canceled successfully', {
          position: 'bottom-center',
        });

        // Refresh booking details
        fetchUserData(); 
      } catch (error) {
        console.error('Error canceling appointment:', error.message);
        toast.error('Failed to cancel appointment. Try again later.', {
          position: 'bottom-center',
        });
      }
    } else {
      toast.info('Appointment cancellation canceled.', {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div className="flex h-screen p-6">
      {userDetails ? (
        <>
          {/* Profile Section */}
          <div className="w-80 h-[800px] bg-white p-6 rounded-lg border border-gray-400 mt-10 ml-56"> 
            <div className="flex flex-col items-center">
              <img
                src={avatar2}
                alt="profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-bold">{userDetails.name}</h2>
              <p className="text-black">{userDetails.email}</p>
              <div className="mt-4 text-sm text-black font-bold">
                <p>Telephone number: {userDetails.number}</p>
                <p>Gender: {userDetails.gender}</p>
                <p>Age: {userDetails.age}</p>
              </div>
              <div className="mt-96 w-full">
                <button
                  className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-4 font-bold"
                  onClick={handleDeleteAccount} 
                >
                  Delete account
                </button>
                <button
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 ml-6 mt-10">
            {/* Tabs */}
            <div className="flex space-x-4 mb-4 ml-5">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md font-bold">
                Bookings
              </button>
            </div>

            {/* Bookings Section */}
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-black mb-5 -mt-5">My Bookings</h3>

              {bookingDetails.length > 0 ? (
                bookingDetails.map((booking) => (
                  <div key={booking.id} className="flex items-center border border-gray-400 h-60 rounded-lg mb-4">
                    <div className="ml-6">
                      <p className="text-lg text-gray-600 font-black">
                        Doctor: {booking.doctorName || 'Not Available'}
                      </p>
                      <p className="text-lg text-gray-600 font-black">
                        Hospital: {booking.hospital || 'Not Available'}
                      </p>
                      <p className="text-lg text-gray-600 font-black">
                        Date: {booking.day || 'Not Available'} 
                      </p>
                      <p className="text-lg text-gray-600 font-black">
                        Time: {booking.time || 'Not Available'}
                      </p>
                      <div className="mt-4 space-x-4">
                        <Link to="/chat">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold">
                            Chat
                          </button>
                        </Link>
                        <button 
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-bold"
                          onClick={() => handleCancelAppointment(booking.id)} 
                        >
                          Cancel appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Pprofile;
