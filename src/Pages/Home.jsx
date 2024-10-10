import React from 'react';
import doc1 from '../assets/images/doc1.png';
import icon2 from '../assets/images/icon2.png';
import icon3 from '../assets/images/icon3.png';
import icon1 from '../assets/images/icon1.png';
import apple from '../assets/images/apple.png';
import google from '../assets/images/google.png';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/pagination'
import { Card } from 'antd'
import vector from '../assets/images/vector.png'
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';

const Home = () => {

  
  return (
    <>
    {/* --hero section-- */}
    <section className='hero__section pt-[60px] 2xl:h-[800px]'>
      <div className='container'>
        <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between'>
          <div className='lg:w-[570px]'>
            <h1 className='text-[36px] leading-[46px] text-headingColor md:text-[60px] md:leading-[70px] font-black lg:mt-32'>
              <span className='text-[#0081FB]'>We</span> Simplify <br />Your <span className='text-[#0081FB]'>Health</span> Journey
            </h1>
            <p className='text__para font-black text-[16px]'>
              Your Health, Your Schedule: Seamless Doctor <br /> Appointments at Your Fingertips
            </p>
            <Link to="/search">
            <button className='btn hover:bg-blue-600'>Set your appointment</button>
            </Link>
            <div className='mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]'>
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                <CountUp start={0} end={30} duration={4}/><span className='text-[#0081FB]'>+</span>
                </h2>
                <p className='text__para'>Years of Experience</p>
              </div>
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                <CountUp start={0} end={50} duration={4}/><span className='text-[#0081FB]'>+</span>
                </h2>
                <p className='text__para'>Number of Doctors</p>
              </div>
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                <CountUp start={0} end={100} duration={4}/><span className='text-[#0081FB]'>%</span>
                </h2>
                <p className='text__para'>Patient satisfaction</p>
              </div>
            </div>
          </div>
          <div className='flex justify-end'>
            <img src={doc1} alt='heroimg' />
          </div>
        </div>
      </div>
    </section>

    {/* --Services section--*/}
    <section>
      <div className='container'>
        <div className='lg:w-[470px] mx-auto'>
            <h2 className='heading text-center font-black text-[50px]'><span className='text-[#0081FB]'>Our</span> Services</h2>
            <p className='leading-[30px] text-center mt-[18px]'> We emphasizing the high standard of medical services offered, combined with a personalized care approach.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 border-sky-500'>
                <div className='flex items-center justify-center'>
                    <img src={icon2} alt='icon1'/>
                </div>
                <div className='mt-[30px]'>
                  <h2 className='text-[16px] leading-9 text-headingColor font-[700] text-center'>Doctor Channelling</h2>
                  <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>Channel your doctor in your convenient way.</p>
                </div>
            </div>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 border-sky-500'>
                <div className='flex items-center justify-center'>
                    <img src={icon3} alt='icon1'/>
                </div>
                <div className='mt-[50px]'>
                  <h2 className='text-[16px] leading-9 text-headingColor font-[700] text-center'>24 hours service</h2>
                  <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>Channel your doctor in your convenient way.</p>
                </div>
            </div>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 border-sky-500'>
                <div className='flex items-center justify-center'>
                    <img src={icon1} alt='icon1'/>
                </div>
                <div className='mt-[50px]'>
                  <h2 className='text-[16px] leading-9 text-headingColor font-[700] text-center'>Chat with doctors</h2>
                  <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>You can easily chat with your appointed doctor.</p>
                </div>
            </div>
        </div>
      </div>
    </section>

     {/* --Download section-- */}
    <section className='w-full bg-gradient-to-r from-sky-500 to-sky-800 h-auto'>
      <div className='mx-auto p-0'>
          <div className="relative flex flex-col items-center text-center">
              <h1 className='text-white sm:text-6xl font-black capitalize text-[50px]'>Start Your Healthy Journey With Us</h1>
              <h1 className='text-center text-[20px] mt-8 text-[#449FF4] font-black leading-10'>
                Get <span className='text-5xl font-black text-white'>Medix</span> app</h1>
              <p className='text-center font-medium mt-8 text-white'>You can channel doctors and consultants from more than 260 private hospitals, clinics, channelling centres, and <br/>
                private ayurvedic hospitals in Sri Lanka by using the Medix Mobile application. This method of channelling doctors <br/>
                and consultants is simple, quick, affordable, and time-efficient.
              </p>
              <div className="flex space-x-4 mt-6 md:mt-8">
                <img className="w-32 h-12 md:w-40 md:h-14" src={google} alt="Google Play Store" />
                <img className="w-32 h-12 md:w-40 md:h-14" src={apple} alt="Apple App Store" />
              </div>
          </div>
      </div>
    </section>

    {/* --specialistts section-- */}
    <section className='container mx-auto'>
      <div className="w-full h-auto rounded-lg border-2 border-black/opacity-25 p-6">
        <h2 className='heading text-center font-black text-[50px] mt-6'>
          <span className='text-[#0081FB]'>Top</span> Specialists
        </h2>
        <p className='leading-[30px] text-center mt-[18px]'>Meet our Specialists</p>

        <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between mt-10'>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Cardiologist</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
              A cardiologist specializes in the structure, functions, and diseases of the heart and blood vessels.
            </p>
          </Card>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Dermatologists</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
            These doctors specialize in diagnosing and treating skin, hair, and nail disorders, including the detection and treatment of skin cancer.
            </p>
          </Card>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Neurosurgeons</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
            Neurosurgeons are medical professionals who specialize in diagnosing and treating conditions related to the brain, spine, and other parts of the nervous system.
            </p>
          </Card>
        </div>

        <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between mt-10'>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Psychiatrists</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
            Doctors specialize in treating mental, behavioural, and emotional disorders, often utilizing therapy and medications.
            </p>
          </Card>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Neurologists</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
            Professionals specialize in diagnosing and treating nervous system-related conditions like epilepsy, migraines, and multiple sclerosis.
            </p>
          </Card>
          <Card className='py-[30px] px-5 w-80 md:w-[500px] h-auto bg-white rounded-2xl shadow-xl hover:scale-105 transition duration-300 ease-in-out hover:bg-sky-500'>
            <h1 className='text-center text-black text-xl font-bold'>Chanel a Endocrinologists</h1>
            <p className='text-center leading-7 text-[16px] mt-4 text-textColor font-[400]'>
            They deal with hormonal imbalances and disorders related to glands such as the thyroid, adrenal, and pituitary glands.
            </p>
          </Card>
        </div>
      </div>
    </section>

    {/* --Steps section-- */}
    <section>
      <div className='container'>
        <div className='lg:w-[870px] mx-auto'>
            <h2 className='heading text-center font-black text-[50px]'><span className='text-[#0081FB]'>Make</span> Your First Appointment <br/>In Few Simple Touch</h2>
            <p className='leading-[30px] text-center mt-[18px]'> Quickly and easily schedule your first appointment.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 border-sky-500'>
                <div className="w-16 h-16 bg-[#0081FB] rounded-full"><h1 className='text-white text-5xl font-bold py-2 px-5'>1</h1></div>
                <div className='mt-[30px]'>
                  <h2 className='text-[20px] leading-9 text-headingColor font-black text-start'>Search your doctor</h2>
                  <p className='text-start leading-7 text-[16px] mt-4 text-textColor font-[400]'>Click the “set your appointment” button and search your doctor as your convenience.</p>
                </div>
            </div>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 bg-[#0081FB]'>
              <div className="w-16 h-16 bg-white rounded-full"><h1 className='text-[#0081FB] text-5xl font-bold py-2 px-4'>2</h1></div>
                <div className='mt-[30px]'>
                  <h2 className='text-[20px] leading-9 text-white font-black text-start'>Select  your doctor</h2>
                  <p className='text-start leading-7 text-[16px] mt-4 text-white font-[400]'>Select your doctor <br/> related to your disease</p>
                </div>
            </div>
            <div className='py-[30px] px-5 w-80 h-96 rounded-lg border-2 border-sky-500'>
            <div className="w-16 h-16 bg-[#0081FB] rounded-full"><h1 className='text-white text-5xl font-bold py-2 px-5'>3</h1></div>
                <div className='mt-[30px]'>
                  <h2 className='text-[20px] leading-9 text-headingColor font-black text-start'>Set the appointment</h2>
                  <p className='text-start leading-7 text-[16px] mt-4 text-textColor font-[400]'>Give the time and date convenient for you and book the appointment.</p>
                </div>
            </div>
        </div>
      </div>
    </section>

    {/* --Reviews section-- */}
    <section>
      <div className='container mx-auto'>
        <div className='lg:w-[470px] mx-auto'>
          <h2 className='heading text-center font-black text-[50px]'>
            <span className='text-[#0081FB]'>Patient</span> Reviews
          </h2>
          <p className='leading-[30px] text-center mt-[18px]'>
            Here’s what some of our patients have to say
          </p>
        </div>
        <div className='mt-[30px] lg:mt-[55px]'>
          <Swiper
          className='pb-12'
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            <SwiperSlide>
              <Card className='py-[30px] px-5 rounded-3 shadow-xl'>
                <div className='flex items-center gap-[13px]'>
                  <img src={vector} alt='Patient' />
                  <h4 className='text-[18px] leading-[40px] font-semibold text-headingColor'>
                    Kavishka Senavirathna
                  </h4>
                </div>
                <div>
                  
                </div>
                <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
                I appreciate the reminder notifications for my appointments
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide>
             <Card className='py-[30px] px-5 rounded-3 shadow-xl'>
                <div className='flex items-center gap-[13px]'>
                  <img src={vector} alt='Patient' />
                  <h4 className='text-[18px] leading-[40px] font-semibold text-headingColor'>
                    Kavishka Senavirathna
                  </h4>
                </div>
                <div>
                  
                </div>
                <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
                This app is a lifesaver! No more waiting on hold for hours. 
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide>
            <Card className='py-[30px] px-5 rounded-3 shadow-xl'>
                <div className='flex items-center gap-[13px]'>
                  <img src={vector} alt='Patient' />
                  <h4 className='text-[18px] leading-[40px] font-semibold text-headingColor'>
                    Kavishka Senavirathna
                  </h4>
                </div>
                <div>
                  
                </div>
                <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
                I liked how the app was able to save my medical history and make it accessible.
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide>
            <Card className='py-[30px] px-5 rounded-3 shadow-xl'>
                <div className='flex items-center gap-[13px]'>
                  <img src={vector} alt='Patient' />
                  <h4 className='text-[18px] leading-[40px] font-semibold text-headingColor'>
                    Kavishka Senavirathna
                  </h4>
                </div>
                <div>
                  
                </div>
                <p className='text-[16px] leading-7 mt-4 text-textColor font-[400]'>
                The appointment booking process is straightforward
                </p>
              </Card>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
    </>
  );
}

export default Home;
