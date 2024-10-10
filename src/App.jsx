import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Componenets/Header';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Preg from './Pages/Preg';
import Dreg from './Pages/Dreg';
import Search from './Pages/Search';
import Footer from './Componenets/Footer';
import Doctor from './Pages/Doctor';
import Bookdone from './Pages/Bookdone';
import Pprofile from './Pages/Pprofile';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dprofile from './Pages/Dprofile';
import Dappoinmet from './Pages/Dappoinment';
import Dsettings from './Pages/Dsettings';
import Chat from './Pages/Chat';

function App() {
  
  return (
    <Router>
      <Header/>
        <Routes>
          <Route path='home' element={<Home/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='preg' element={<Preg/>}/>
          <Route path='dreg' element={<Dreg/>}/>
          <Route path='search' element={<Search/>}/>
          <Route path='doctor' element={<Doctor/>}/>
          <Route path='bookdone' element={<Bookdone/>}/>
          <Route path='pprofile' element={<Pprofile/>}/>
          <Route path='dprofile' element={<Dprofile/>}/>
          <Route path='dappoinment' element={<Dappoinmet/>}/>
          <Route path='dsettings' element={<Dsettings/>}/>
          <Route path='chat' element={<Chat/>}/>
        </Routes>
        <ToastContainer/>
       <Footer/> 
    </Router>
  )
}

export default App
