import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import './App.css'
import Schedules from "./components/Schedules.jsx";
import HomePage from "./components/HomePage.jsx";
import StudyPlan from "./components/StudyPlan.jsx";
import JopSearch from "./components/JopSearch.jsx";
import Footer from "./components/Footer.jsx";
import WeatherAbuDhabi from "./components/weather/WeatherAbuDhabi.jsx";
import MemoryGame from "./components/game/MemoryGame.jsx";
import Tracker from "./components/nutrition/Tracker.jsx";
import TodoAndDone from "./components/todo/TodoAndDone.jsx";
import Moody from "./components/mood/Moody.jsx";
import CourseNotebook from "./components/study_adu/Notebook.jsx";
import LanguageTrack from "./components/Language/LanguageTrack.jsx";
import LandingPage from "./components/LandingPage.jsx"; // Import the new LandingPage

function App() {
  return (
      <BrowserRouter>
            <Routes>
                {/* Landing Page as the root path */}
                <Route path="/" element={<LandingPage/>}/>

                {/* Home Page as a separate route */}
                <Route path="/home" element={<HomePage/>}/>

                {/* All other routes remain the same */}
                <Route path="/schedule" element={<Schedules/>}/>
                <Route path="/studyPlan" element={<StudyPlan/>}/>
                <Route path="/jobSearch" element={<JopSearch/>}/>
                <Route path="/weather" element={<WeatherAbuDhabi/>}/>
                <Route path="/memorygame" element={<MemoryGame/>}/>
                <Route path="/Tracker" element={<Tracker/>}/>
                <Route path="/TodoAndDone" element={<TodoAndDone/>}/>
                <Route path="/moody" element={<Moody/>}/>
                <Route path="/course" element={<CourseNotebook/>}/>
                <Route path="/language" element={<LanguageTrack/>}/>
            </Routes>
          <Footer/>
      </BrowserRouter>
  )
}

export default App