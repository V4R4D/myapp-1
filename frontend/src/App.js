
import React from 'react';
import { useState } from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup';
import Reset from './components/reset';
import Login from './components/login';
import User from './components/userpage';


function App() {

  const [email, setemail] = useState('')

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={< Login email={email} setemail={setemail}/>}></Route>
          <Route exact path="/signup" element={< Signup email={email} setemail={setemail}/>}></Route>
          <Route exact path="/reset" element={< Reset />}></Route>
          <Route exact path="/userpage" element={< User email={email} setemail = {setemail}/>}></Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;