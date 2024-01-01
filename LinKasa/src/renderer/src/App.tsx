import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LayoutController from './controller/LayoutController';
import NewStaffForm from './components/NewStaffForm';
import LostAndFoundLog from './components/LostAndFoundLog';
import ItemForm from './components/ItemForm';
import FlightSchedules from './components/FlightSchedules';
import ScheduleForm from './components/ScheduleForm';
import ChatRoom from './components/ChatRoom';
import { AuthProvider } from './model/AuthContext';
import StaffsPage from './components/StaffsPage';
import FeedbackPage from './components/FeedbackPage';
import NewFeedbackForm from './components/NewFeedbackForm';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<LayoutController />} />
          <Route path="/create-staff-data" element={<NewStaffForm />} />
          <Route path="/lost-and-found-log" element={<LostAndFoundLog />}>
            <Route path="update" element={<ItemForm />} />
          </Route>
          <Route path="/flight-schedules" element={<FlightSchedules />}>
            <Route path="create" element={<ScheduleForm />} />
          </Route>
          <Route path="/chat-room" element={<ChatRoom />} />
          <Route path="/view-staffs" element={<StaffsPage />} />
          <Route path="/feedback" element={<FeedbackPage />}></Route>
          <Route path="/create-feedback" element={<NewFeedbackForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
