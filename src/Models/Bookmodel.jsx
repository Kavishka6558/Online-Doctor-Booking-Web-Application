import React, { useState, useEffect } from 'react';
import { Button, Select, Calendar, message } from 'antd'; 
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase'; 
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore'; 
import moment from 'moment';

const { Option } = Select;

const Time = ({ time, onClick, selected }) => (
  <div
    className={`relative w-[90px] h-[35px] flex items-center justify-center rounded-md border border-gray-300 cursor-pointer text-sm font-medium leading-[21px] ${
      selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
    }`}
    onClick={() => onClick(time)}
  >
    {time}
  </div>
);

function BookModel({ showModal, setShowModal, doctorId }) {
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); 
  const [doctorName, setDoctorName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(firestore, 'Users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            name: userSnap.data().name,
          });
        } else {
          console.error('User data not found in Firestore');
        }
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        const doctorRef = doc(firestore, 'Doctors', doctorId);
        const doctorSnap = await getDoc(doctorRef);

        if (doctorSnap.exists()) {
          const doctorData = doctorSnap.data();
          setDoctorName(doctorData.name);
        } else {
          console.log('Doctor not found');
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    if (showModal && doctorId) {
      fetchDoctorDetails();
      fetchUserData();
    }
  }, [showModal, doctorId]);

  // Fetch times for the selected day
  const fetchTimesByDay = async (dayOfWeek) => {
    setLoading(true);
    try {
      const timeslotRef = doc(firestore, 'Timeslots', doctorId); // Fetch the document based on the doctorId
      const timeslotSnap = await getDoc(timeslotRef);

      if (timeslotSnap.exists()) {
        const data = timeslotSnap.data();
        const dayTimes = data.timeslots[dayOfWeek]; // Get the array of times for the selected day
        
        if (dayTimes && dayTimes.length > 0) {
          // Check existing bookings and filter out booked times
          const bookedTimes = await fetchBookedTimes(selectedDay, doctorId);
          const availableTimes = dayTimes.filter(time => !bookedTimes.includes(time)); // Filter out booked times
          setTimes(availableTimes);
        } else {
          setTimes([]); 
        }
      } else {
        setTimes([]);
        console.log('No timeslot data found for this doctor.');
      }
    } catch (error) {
      setTimes([]);
      console.error('Error fetching times:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch booked times for the selected day and doctor
  const fetchBookedTimes = async (selectedDay, doctorId) => {
    const bookingRef = collection(firestore, 'Bookings');
    const bookingQuery = query(
      bookingRef,
      where('doctorId', '==', doctorId),
      where('day', '==', moment(selectedDay).format('YYYY-MM-DD')) 
    );
    const bookingSnapshot = await getDocs(bookingQuery);

    const bookedTimes = bookingSnapshot.docs.map(doc => doc.data().time); 
    return bookedTimes;
  };

  const handleDateChange = (date) => {
    const dayOfWeek = moment(date).format('dddd'); 
    setSelectedDay(date); // Set the selected date
    fetchTimesByDay(dayOfWeek); // Fetch available times for the selected day of the week
  };

  // Disable past dates
  const disablePastDates = (current) => {
    return current && current < moment().startOf('day');
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const checkExistingBooking = async () => {
    if (!selectedDay || !selectedTime || !user) return false;

    const bookingRef = collection(firestore, 'Bookings');
    const bookingQuery = query(
      bookingRef,
      where('doctorId', '==', doctorId),
      where('day', '==', moment(selectedDay).format('YYYY-MM-DD')), 
      where('time', '==', selectedTime)
    );

    const bookingSnapshot = await getDocs(bookingQuery);
    return !bookingSnapshot.empty;
  };

  const handleBooking = async () => {
    try {
      if (!selectedHospital || !selectedDay || !selectedTime || !user) {
        console.log('Please select all required fields');
        return;
      }

      const existingBooking = await checkExistingBooking();
      if (existingBooking) {
        message.error('This time slot is already booked. Please choose a different time.');
        return;
      }

      const bookingData = {
        doctorId,
        doctorName,
        hospital: selectedHospital,
        day: moment(selectedDay).format('YYYY-MM-DD'), 
        time: selectedTime,
        userId: user.uid,
        userName: user.name,
        createdAt: new Date(),
        weekDay: moment(selectedDay).format('dddd') 
      };

      const bookingsRef = collection(firestore, 'Bookings');
      await addDoc(bookingsRef, bookingData);

      console.log('Booking saved successfully:', bookingData);
      navigate('/bookdone');
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-[660px] h-auto bg-white rounded-lg shadow p-6">
        <div className="text-black text-xl font-bold leading-[30px] mb-6">Book Appointment</div>

        {/* Select Hospital */}
        <div className="mb-4">
          <Select
            className="w-full"
            placeholder="Select Hospital"
            value={selectedHospital}
            onChange={value => setSelectedHospital(value)}
          >
            <Option value="Kandy">Kandy</Option>
            <Option value="Matale">Matale</Option>
            <Option value="Colombo">Colombo</Option>
          </Select>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <div className="text-lg font-medium mb-2">Select Date</div>
          <Calendar
            fullscreen={false}
            onSelect={handleDateChange} // Trigger fetching times when a date is selected
            disabledDate={disablePastDates} 
            className="rounded-md border-gray-300"
          />
        </div>

        {/* Time Slots */}
        <div className="w-full h-[181px] rounded-lg border border-black/25 mb-6 p-4 grid grid-cols-3 gap-4">
          {loading ? (
            <div className="w-full text-center text-gray-500">Loading times...</div>
          ) : times.length > 0 ? (
            times.map((time, index) => (
              <Time
                key={index}
                time={time}
                onClick={handleTimeClick}
                selected={selectedTime === time}
              />
            ))
          ) : (
            <div className="w-full text-center text-gray-500">No available times for this day</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <Button
            className="px-4 py-2 bg-gray-300 rounded-lg mr-2 h-10 font-bold"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 bg-[#0081fb] text-white rounded-lg h-10 font-bold"
            onClick={handleBooking}
            disabled={!selectedHospital || !selectedDay || !selectedTime}
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookModel;
