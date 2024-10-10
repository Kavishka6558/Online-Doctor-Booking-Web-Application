import React, { useState, useEffect } from 'react';
import about from '../assets/images/about.png';
import Bookmodel from '../Models/Bookmodel';
import { AiFillStar } from 'react-icons/ai';
import { firestore, auth } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation } from 'react-router-dom';

const Doctor = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // Authenticate user
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (state && state.role) {
        try {
          const searchRef = collection(firestore, 'Search');
          const searchQuery = await getDocs(query(searchRef, where('role', '==', state.role)));
          
          if (!searchQuery.empty) {
            const doctorDoc = searchQuery.docs[0].data();
            const docId = searchQuery.docs[0].id;
            setDoctorData(doctorDoc);
            setDoctorId(docId);

            // Fetch reviews for the doctor using a query
            const feedbackRef = collection(firestore, 'feedbacks');
            const feedbackQuery = await getDocs(query(feedbackRef, where('doctorId', '==', docId)));
            const feedbackList = feedbackQuery.docs.map(doc => doc.data());
            setReviews(feedbackList);
          } else {
            console.error('No such doctor with the specified role!');
          }
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctorData();
  }, [state]);

  const handleFeedbackSubmit = async () => {
    if (feedbackText.trim() === '') {
      alert('Feedback cannot be empty!');
      return;
    }

    if (!user) {
      alert('You must be logged in to submit feedback.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'feedbacks'), {
        doctorId: doctorId,
        text: feedbackText,
        name: user.displayName || 'Anonymous',
        rating: 5
      });
      setFeedbackText('');
      setShowFeedbackForm(false);

      // Fetch updated reviews
      const feedbackRef = collection(firestore, 'feedbacks');
      const feedbackQuery = await getDocs(query(feedbackRef, where('doctorId', '==', doctorId)));
      const feedbackList = feedbackQuery.docs.map(doc => doc.data());
      setReviews(feedbackList);

      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading doctor information...</div>;
  }

  return (
    <section>
      <div className="container mx-auto p-4">
        <div className="relative bg-white rounded-lg border border-black/25 p-6 flex">
          <div className="relative w-[167px] h-[219px]">
            <img
              className="absolute w-full h-full rounded-[10px] border border-black/25"
              src={about}
              alt="Doctor"
            />
          </div>
          <div className="ml-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {doctorData ? `Dr. ${doctorData.name}` : 'Loading...'}
              </h2>
              <div className="mt-2 bg-[#0081fb]/50 rounded-lg inline-block px-2 py-1 text-white text-xs font-semibold">
                {doctorData ? doctorData.specialty : 'Loading...'}
              </div>
              <div className="mt-4">
                <h1 className="text-sm font-semibold">
                  Education: <span className="font-normal">{doctorData?.education || 'MBBS, UK'}</span>
                </h1>
              </div>
            </div>
            <div className="mt-6">
              <button
                className="w-[221px] h-[41px] bg-[#0081fb] rounded-lg text-white text-base font-medium shadow hover:bg-blue-600"
                onClick={() => setShowModal(true)}
              >
                Book Appointment
              </button>
              {showModal && <Bookmodel showModal={showModal} setShowModal={setShowModal} doctorId={doctorId} />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4 mt-8">
        <div className="relative bg-white rounded-lg border border-black/25 p-6">
          <h4 className="text-[20px] leading-[30px] font-black text-headingColor mb-[30px]">
            All reviews ({reviews.length})
          </h4>
          
          {reviews.map((review, index) => (
            <div className="flex gap-6 mb-4" key={index}>
              <div className="flex justify-between w-full">
                <div>
                  {/* <h5 className="font-semibold">{review.name}</h5> */}
                  <p className="text-sm text-gray-500">{review.text}</p>
                </div>
                <div className="flex gap-1 items-center">
                  {[...Array(review.rating)].map((_, idx) => (
                    <AiFillStar key={idx} color="yellow" />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!showFeedbackForm && (
            <div className='text-center'>
              <button className='btn rounded-lg hover:bg-blue-600' onClick={() => setShowFeedbackForm(true)}>Give Feedback</button>
            </div>
          )}
          {showFeedbackForm && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Write your feedback here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <button
                className="mt-2 btn bg-[#0081fb] text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={handleFeedbackSubmit}
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctor;
