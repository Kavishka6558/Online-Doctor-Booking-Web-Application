import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { BiRightArrow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import dr from '../assets/images/dr.jpeg'; 

// Create doctor card component
const DoctorCard = ({ doctor, onClick }) => (
  <div className="w-full sm:w-[243px] h-[300px] relative mb-6 mx-auto">
    <div onClick={() => onClick(doctor)} className="cursor-pointer">
      <img src={doctor.image || dr} alt={doctor.name || 'Doctor'} className="w-full h-[173px] object-cover rounded-t-lg" />
      <button className="bg-[#0081fb] rounded-lg h-10 flex items-center justify-center px-4 absolute bottom-0 w-full hover:bg-blue-600">
        <BiRightArrow className="text-white" />
      </button>
      <div className="absolute top-0 text-black text-[15px] font-bold leading-[400px] px-2">
        {doctor.name || 'Doctor'}
      </div>
      <div className="bg-[#0081fb]/50 rounded-lg h-7 px-2 py-1.5 absolute top-[220px] flex items-center justify-center">
        <div className="text-white text-xs font-semibold">{doctor.specialty || 'Specialty'}</div>
      </div>
      <div className="bg-white rounded-lg border border-black/20 h-7 px-2 py-1.5 absolute top-[220px] right-0 flex items-center justify-center">
        <div className="text-black text-xs font-extrabold">{doctor.hospital || 'Hospital'}</div>
      </div>
    </div>
  </div>
);

const Search = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Search'));
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList); // Initialize filteredDoctors with full list
    };

    fetchDoctors();
  }, []);

  // Fetch doctor details from Firestore 'Doctors' collection
  const handleDoctorClick = async (doctor) => {
    try {
      const docRef = doc(firestore, 'Doctors', doctor.id);
      const doctorDoc = await getDoc(docRef);

      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        if (doctorData.role) {
          console.log("Doctor's Role:", doctorData.role);
          console.log("Doctor's Name:", doctorData.name);
          console.log("Doctor's Specialty:", doctorData.specialty);
          navigate('/doctor', { state: { ...doctorData } });
        } else {
          console.error('Role not found for this doctor');
        }
      } else {
        console.error('No such doctor found!');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filtering logic for doctors based on search term, specialty, and hospital
    const filteredDoctorsList = doctors.filter((doctor) => {
      const matchName = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Convert both specialty values to lowercase for case-insensitive matching
      const matchSpecialty = selectedSpecialty
        ? doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
        : true;

      // Convert both hospital values to lowercase for case-insensitive matching
      const matchHospital = selectedHospital
        ? doctor.hospital.toLowerCase() === selectedHospital.toLowerCase()
        : true;

      return matchName && matchSpecialty && matchHospital;
    });

    setFilteredDoctors(filteredDoctorsList);
  };

  return (
    <>
      <section className="bg-gray-50 py-8 ml-20">
        <div className="container mx-auto text-center p-4">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-[#0081FB]">Search</span> Doctors
            </h2>
            <p className="leading-[30px] text-center text-gray-600">
              Search your doctor and book an appointment in one click.
            </p>
          </div>
          <form className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4 lg:mt-10 items-center" onSubmit={handleSubmit}>
            <input
              className="w-full h-14 rounded-lg border-2 border-sky-500 py-4 px-4 bg-transparent flex-1"
              type="search"
              placeholder="Doctor Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              name="specialty"
              className="w-full h-14 rounded-lg border-2 border-sky-500 py-4 px-4 bg-transparent flex-1 cursor-pointer"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Medical Specialty</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="dermatologist">Dermatologist</option>
              <option value="neurosurgeon">Neurosurgeon</option>
              <option value="psychiatrist">Psychiatrist</option>
              <option value="neurologist">Neurologist</option>
              <option value="endocrinologist">Endocrinologist</option>
            </select>
            <select
              name="hospital"
              className="w-full h-14 rounded-lg border-2 border-sky-500 py-4 px-4 bg-transparent flex-1 cursor-pointer"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">Hospital</option>
              <option value="Kandy">Kandy</option>
              <option value="Colombo">Colombo</option>
              <option value="Matale">Matale</option>
            </select>
            <button type="submit" className="w-full md:w-40 h-14 rounded-md bg-blue-500 text-white py-2 hover:bg-blue-600">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4">
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onClick={handleDoctorClick} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No doctors found matching your criteria.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Search;
