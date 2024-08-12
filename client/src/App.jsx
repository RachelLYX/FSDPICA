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
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path={"/"} element={<Programs />} />
            <Route path={"/programs"} element={<Programs />} />
            <Route path={"/addprogram"} element={<AddProgram />} />
            <Route path={"/editprogram/:id"} element={<EditProgram />} />
            <Route
              path={"/volunteeringprograms"}
              element={<VolunteerPrograms />}
            />
            <Route path={"/addactivity"} element={<AddActivity />} />
            <Route path={"/editactivity/:id"} element={<EditActivity />} />
            <Route path={"/reviews"} element={<Reviews />} />
            <Route path={"/rewards"} element={<Rewards />} />
            <Route path={"/volunteering"} element={<Volunteering />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
