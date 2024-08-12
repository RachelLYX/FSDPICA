import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import PrivateRoute from './Components/PrivateRoute';
import Events from './Components/Events';
import RegistrationSelection from './Components/RegistrationSelection';
import IndividualRegistration from './Components/IndividualRegistration';
import GroupRegistration from './Components/GroupRegistration';
import BookingConfirmation from './Components/BookingConfirmation';
import BookingDetails from './Components/BookingDetails';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='/dashboard/employee' element={<Employee />} />
          <Route path='/dashboard/category' element={<Category />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route path='/dashboard/add_category' element={<AddCategory />} />
          <Route path='/dashboard/add_employee' element={<AddEmployee />} />
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />} />
          <Route path="/dashboard/booking_details/:id" element={<BookingDetails />} />
        </Route>
        <Route path='/events' element={<Events />} />
        <Route path='/register/:eventId' element={<RegistrationSelection />} />
        <Route path='/register/:eventId/individual' element={<IndividualRegistration />} />
        <Route path='/register/:eventId/group' element={<GroupRegistration />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

