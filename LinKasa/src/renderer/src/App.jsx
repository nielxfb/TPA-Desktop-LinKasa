import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NewStaffForm from './components/NewStaffForm'
import LayoutController from './controller/LayoutController'
import LostAndFoundLog from './components/LostAndFoundLog'
import ItemForm from './components/ItemForm'

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={ <LayoutController /> } />
          <Route path='/create-staff-data' element={ <NewStaffForm /> } />
          <Route path='/lost-and-found-log' element={ <LostAndFoundLog /> }>
            <Route path='update' element={ <ItemForm /> } />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;
