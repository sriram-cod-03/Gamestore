import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PaymentPage from "./Components/PaymentPage";
import GamesCategory from "./Components/GamesCategory";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/searchresults" element={<SearchResults />} />

        {/*GAME DETAILS*/}
        <Route path="/game/:id" element={<GameDetails />} />
        {/*PAYMENT ROUTE*/}
        <Route path="/payment/:id" element={<PaymentPage />} />
        {/*CATEGORY ROUTE*/}
        <Route path="/games/:category" element={<GamesCategory />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
