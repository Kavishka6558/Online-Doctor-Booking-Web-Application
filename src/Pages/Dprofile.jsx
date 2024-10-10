import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import drImage from '../assets/images/dr.jpeg'; 

const DProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(firestore, 'Doctors', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
          toast.error('Error fetching user data', {
            position: 'bottom-center',
          });
        } finally {
          setLoading(false);
        }
      } else {
        console.log('User is not logged in');
        toast.error('User is not logged in', {
          position: 'bottom-center',
        });
        setLoading(false);
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    
    if (confirmed) {
      const user = auth.currentUser;

      if (user) {
        try {
          // Delete user data from Firestore
          await deleteDoc(doc(firestore, 'Doctors', user.uid));
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
          } else {
            console.error('Error deleting account:', error.message);
            toast.error('Failed to delete account. Try again later.', {
              position: 'bottom-center',
            });
          }
        }
      }
    } else {
      toast.info('Account deletion canceled.', {
        position: 'bottom-center',
      });
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
        <div className="mt-[500px]">
          <button
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-4 font-bold"
            onClick={handleDeleteAccount} // Add delete account handler
          >
            Delete Account
          </button>
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
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-xl font-bold">
            Profile
          </button>
          <Link to="/dappoinment">
            <button className="px-4 py-2 bg-white text-black rounded-md font-bold shadow-xl hover:bg-blue-500">
              Appointments
            </button>
          </Link>
          <Link to="/dsettings">
            <button className="px-4 py-2 bg-white text-black rounded-md font-bold shadow-xl hover:bg-blue-600">
              Settings
            </button>
          </Link>
        </div>

        {/* Profile Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-300 w-[1100px]">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Name</td>
                <td className="py-2 text-gray-800">{userDetails.name || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Telephone number</td>
                <td className="py-2 text-gray-800">{userDetails.number || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Currently working hospital</td>
                <td className="py-2 text-gray-800">{userDetails.hospital || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Specialization</td>
                <td className="py-2 text-gray-800">{userDetails.specialty || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Working hospitals</td>
                <td className="py-2 text-gray-800">
                  {userDetails.hospital || 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold text-gray-600">Qualification</td>
                <td className="py-2 text-gray-800">MBBS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DProfile;
