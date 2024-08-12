import "./App.css";
import { Container, AppBar, Toolbar, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Programs from "./pages/Programs.jsx";
import AddProgram from "./pages/AddProgram.jsx";
import EditProgram from "./pages/EditProgram.jsx";
import { ThemeProvider } from "@mui/material/styles";
import ProgramStyle from "./themes/ProgramStyle.js";
import VolunteerPrograms from "./pages/VolunteerPrograms.jsx";
import AddActivity from "./pages/AddActivity.jsx";
import EditActivity from "./pages/EditActivity.jsx";
import Reviews from "./pages/Reviews.jsx";
import Rewards from "./pages/Rewards.jsx";
import Volunteering from "./pages/Volunteering.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import HomePage from "./pages/HomePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Employee from './pages/Employee';
import Category from './pages/Category';
import AddCategory from './pages/AddCategory';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Start from './pages/Start';
import PrivateRoute from './pages/PrivateRoute';
import Events from './pages/Events';
import RegistrationSelection from './pages/RegistrationSelection';
import IndividualRegistration from './pages/IndividualRegistration';
import GroupRegistration from './pages/GroupRegistration';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingDetails from './pages/BookingDetails';

import Chat from './pages/Chat';
import ForumList from './forum_components/ForumList';
import ForumDetail from './forum_components/ForumDetail';
import CreateForum from './forum_components/CreateForum';

const User = "Dave Smith";

function App() {
  return (
    <Router>
      <ThemeProvider theme={ProgramStyle}>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  SUSTAINHUB
                </Typography>
              </Link>
              <Link to="/register">
                <Typography>Register</Typography>
              </Link>
              <Link to="/login">
                <Typography>Login</Typography>
              </Link>
              <Link to="/programs">
                <Typography>Programs</Typography>
              </Link>
              <Link to="/volunteeringprograms">
                <Typography>Volunteering</Typography>
              </Link>
              <Link to="/communityChat"><Typography>Community Chat</Typography></Link>
              <Link to="/communityThreads"><Typography>Community Threads</Typography></Link>
              <Link to="/reviews">
                <Typography>Reviews</Typography>
              </Link>
              <Link to="/rewards">
                <Typography>Rewards</Typography>
              </Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/programs" element={<Programs />} />
            <Route path="/addprogram" element={<AddProgram />} />
            <Route path="/editprogram/:id" element={<EditProgram />} />
            <Route path="/volunteeringprograms" element={<VolunteerPrograms />} />
            <Route path="/addactivity" element={<AddActivity />} />
            <Route path="/editactivity/:id" element={<EditActivity />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/volunteering" element={<Volunteering />} />

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
              <Route path='/dashboard/booking_details/:id' element={<BookingDetails />} />
            </Route>
            <Route path='/events' element={<Events />} />
            <Route path='/register/:eventId' element={<RegistrationSelection />} />
            <Route path='/register/:eventId/individual' element={<IndividualRegistration />} />
            <Route path='/register/:eventId/group' element={<GroupRegistration />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path={"/communityChat"} element={<Chat />} />
            <Route path={"/communityThreads"} element={<ForumList />} />
            <Route path={"/forum/:forumId"} element={<ForumDetail />} />
            <Route path={"/create-forum"} element={<CreateForum />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;

