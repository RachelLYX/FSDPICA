import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import http from '../http'
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
import global from '../global';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';


function Volunteering() {
  const [volunteerList, setVolunteerList] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getVolunteer = () => {
    http.get('./volunteering').then((res) => {
        setVolunteerList(res.data);
    });
  };

  const searchVolunteer = () => {
    http.get(`/volunteering?search=${search}`).then((res) => {
        setVolunteerList(res.data);
    });
  };

  useEffect(() => {
    getVolunteer();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
        searchVolunteer();
    };
  };

  const onClickSearch = () => {
    searchVolunteer();
  };

  const onClickClear = () => {
    setSearch('');
    getVolunteer();
  };

  const handleClickOpen = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVolunteer(null);
  };

  const deleteVolunteer = async () => {
    try {
        await http.delete(`/volunteering/${selectedVolunteer.id}`);
        setVolunteerList(volunteerList.filter(volunteer => volunteer.id !== selectedVolunteer.id));
        handleClose();
    } catch (error) {
        console.error('Error deleting activity:', error);
        handleClose();
    }
  };

  return (
    <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
            Volunteering Activities
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown}/>
            <IconButton color="primary" onClick={onClickSearch}>
                <Search />
            </IconButton>
            <IconButton color="primary" onClick={onClickClear}>
                <Clear />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Link to="/addactivity" style={{ textDecoration: 'none' }}>
                <Button variant='contained'>
                    Sign up for new activity
                </Button>
            </Link>
        </Box>

        <Grid container spacing={2}>
            {
                volunteerList.map((volunteer, i) => {
                    return (
                        <Grid item xs={12} md={6} lg={4} key={volunteer.id}>
                            <Card sx={{ backgroundColor: '#006400', color: 'white' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1}} color="text.secondary">
                                    <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                                        Program: {volunteer.Program}
                                    </Typography>
                                    <Link to={`/editactivity/${volunteer.id}`}>
                                        <IconButton color="primary" sx={{ padding: '4px', color: 'white' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <IconButton color="primary" sx={{ padding: '4px', color: 'white' }} onClick={() => handleClickOpen(volunteer)}>
                                        <Delete />
                                    </IconButton>
                                        <AccessTime sx={{ mr: 1, color: 'white'}} />
                                        <Typography sx={{ color: 'white' }}>
                                            {dayjs(volunteer.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        Name: {volunteer.Name}
                                    </Typography>
                                    <Typography sx={{ whitespace: 'pre-wrap' }}>
                                        Contact Number: {volunteer.Contact_Number}
                                    </Typography>
                                    <Typography sx={{ whitespace: 'pre-wrap' }}>
                                        Date: {volunteer.Date}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })
            }
        </Grid>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Withdraw from program
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to withdraw from this program?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='inherit' onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={deleteVolunteer}>
                    Withdraw
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  )
}

export default Volunteering