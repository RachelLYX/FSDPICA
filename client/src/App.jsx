import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Programs from './pages/Programs.jsx';
import AddProgram from './pages/AddProgram.jsx';
import EditProgram from './pages/EditProgram.jsx';
import { ThemeProvider } from '@mui/material/styles';
import ProgramStyle from './themes/ProgramStyle.js';
import Volunteer from './pages/Volunteering.jsx';
import AddActivity from './pages/AddActivity.jsx';
import EditActivity from './pages/EditActivity.jsx';

function App() {
  return (
    <Router>
      <ThemeProvider theme={ProgramStyle}>
        <AppBar position='static' className='AppBar'>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant='h6' component='div'>
                  SUSTAINHUB
                </Typography>
              </Link>
              <Link to="/programs"><Typography>Programs</Typography></Link>
              <Link to="/volunteering"><Typography>Volunteering activities</Typography></Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Programs />} />
            <Route path={"/programs"} element={<Programs />} />
            <Route path={"/addprogram"} element={<AddProgram />} />
            <Route path={"/editprogram/:id"} element={<EditProgram />} />
            <Route path={"/volunteering"} element={<Volunteer />} />
            <Route path={"/addactivity"} element={<AddActivity />} />
            <Route path={"/editactivity/:id"} element={<EditActivity />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;