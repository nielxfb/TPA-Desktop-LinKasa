import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LayoutController from './controller/LayoutController'
import NewStaffForm from './components/NewStaffForm'
import LostAndFoundLog from './components/LostAndFoundLog'
import ItemForm from './components/ItemForm'
import FlightSchedules from './components/FlightSchedules'

function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={<LayoutController />} />
          <Route path='/create-staff-data' element={<NewStaffForm />} />
          <Route path='/lost-and-found-log' element={<LostAndFoundLog />}>
            <Route path='update' element={<ItemForm />} />
          </Route>
          <Route path='/flight-schedules' element={<FlightSchedules />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
