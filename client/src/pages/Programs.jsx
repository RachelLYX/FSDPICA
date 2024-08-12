import React, { useEffect, useState } from 'react';
import { Box, CardContent, IconButton, Typography, Grid, Card, Input, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';

function Programs() {
  const [programList, setProgramList] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getPrograms = () => {
    http.get('/programs').then((res) => {
      setProgramList(res.data);
    });
  };

  const searchPrograms = () => {
    http.get(`/programs?search=${search}`).then((res) => {
      setProgramList(res.data);
    });
  };

  useEffect(() => {
    getPrograms();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPrograms();
    }
  };

  const onClickSearch = () => {
    searchPrograms();
  };

  const onClickClear = () => {
    setSearch('');
    getPrograms();
  };

  const handleClickOpen = (program) => {
    setSelectedProgram(program);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProgram(null);
  };

  const deleteProgram = async () => {
    try {
      await http.delete(`/programs/${selectedProgram.id}`);
      setProgramList(programList.filter(program => program.id !== selectedProgram.id));
      handleClose();
    } catch (error) {
      console.error('Error deleting activity:', error);
      handleClose();
    }
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ my: 2 }}>
        Programs
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input value={search} placeholder='Search' onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color='primary' onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color='primary' onClick={onClickClear}>
          <Clear />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Link to='/addprogram' style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add Program
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        {
          programList.map((program, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={program.id}>
                <Card sx={{ backgroundColor: '#006400', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color='text.secondary'>
                      <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                        {program.Program}
                      </Typography>
                      <AccessTime sx={{ mr: 1, color: 'white' }} />
                      <Typography sx={{ color: 'white' }}>
                        {dayjs(program.createdAt).format(global.datetimeFormat)}
                      </Typography>
                      <Link to={`/editprogram/${program.id}`}>
                        <IconButton color='primary' sx={{ padding: '4px', color: 'white' }}>
                          <Edit />
                        </IconButton>
                      </Link>
                      <IconButton color="primary" sx={{ padding: '4px', color: 'white' }} onClick={() => handleClickOpen(program)}>
                        <Delete />
                      </IconButton>
                    </Box>

                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      Venue: {program.Venue}
                    </Typography>
                    <Typography sx={{ whitespace: 'pre-wrap' }}>
                      Time: {program.Time}
                    </Typography>
                    <Typography sx={{ whitespace: 'pre-wrap' }}>
                      Date: {program.Date}
                    </Typography>
                    <Typography sx={{ whitespace: 'pre-wrap' }}>
                      Lunch: {program.Lunch}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
      <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Delete program
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this program?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='inherit' onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={deleteProgram}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Programs;