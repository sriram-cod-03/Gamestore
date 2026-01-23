import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";
import Home from "./Pages/Home";



function App() {
  return (
    <Routes>
      {/* when path is "/", redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/searchresults" element={<SearchResults/>}/>
      <Route path="/gamedetails" element={<GameDetails/>}/>
      <Route path="/home" element={<Home/>}/>

    </Routes>
  );
}

export default App;
