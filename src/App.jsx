import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import './App.css'
import Schedules from "./components/Schedules.jsx";
import HomePage from "./components/HomePage.jsx";
import StudyPlan from "./components/StudyPlan.jsx";
import JopSearch from "./components/JopSearch.jsx";
import Footer from "./components/Footer.jsx";

function App() {


  return (
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/schedule" element={<Schedules/>}/>
                <Route path="/studyPlan" element={<StudyPlan/>}/>
                <Route path="/jobSearch" element={<JopSearch/>}/>
            </Routes>
          <Footer/>
      </BrowserRouter>

  )
}

export default App
