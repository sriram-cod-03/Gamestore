import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import PageNotFound from './Components/PageNotFound'
import Footer from './Components/Footer'
import SignUp from './Pages/SignUp'
import GameDetails from './Pages/GameDetails'
import SearchResults from './Pages/SearchResults'
import GamesCategory from './Components/GamesCategory'
import PaymentPage from './Components/PaymentPage'


function App() {
  

  return (
    <>
      <Navbar/>
      
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/game/:id" element={<GameDetails/>}/>
          <Route path="/search/:query" element={<SearchResults/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signUp" element={<SignUp/>} />
          <Route path='*' element={<PageNotFound/>}/>
            {/* Dynamic category route */}
                <Route path="/games/:category" element={< GamesCategory/>} />
            <Route path="/payment/:id" element={<PaymentPage/>} />
        </Routes>
      </div>
       <Footer/>
    </>
  )
}

export default App
