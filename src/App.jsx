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

function App() {


  return (
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/schedule" element={<Schedules/>}/>
                <Route path="/studyPlan" element={<StudyPlan/>}/>
                <Route path="/jobSearch" element={<JopSearch/>}/>
                <Route path="/weather" element={<WeatherAbuDhabi/>}/>
                <Route path="/memorygame" element={<MemoryGame/>}/>
                <Route path="/Tracker" element={<Tracker/>}/>
                <Route path="/TodoAndDone" element={<TodoAndDone/>}/>
            </Routes>
          <Footer/>
      </BrowserRouter>

  )
}

export default App
