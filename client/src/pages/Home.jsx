import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [confirmedIndividualBookings, setConfirmedIndividualBookings] = useState([]);
  const [confirmedGroupBookings, setConfirmedGroupBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchConfirmedIndividualBookings();
    fetchConfirmedGroupBookings();
    fetchTotalBookingsCount();
    fetchConfirmedBookingsCount();
    fetchPendingBookingsCount();
  }, []);

  const fetchConfirmedIndividualBookings = () => {
    axios.get('http://localhost:3000/auth/confirmed_individual_bookings')
      .then(result => {
        if (result.data.Status) {
          setConfirmedIndividualBookings(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const fetchConfirmedGroupBookings = () => {
    axios.get('http://localhost:3000/auth/confirmed_group_bookings')
      .then(result => {
        if (result.data.Status) {
          setConfirmedGroupBookings(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const fetchTotalBookingsCount = () => {
    axios.get('http://localhost:3000/auth/total_bookings_count')
      .then(result => {
        if (result.data.Status) {
          setTotalBookings(result.data.Result[0].total);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const fetchConfirmedBookingsCount = () => {
    axios.get('http://localhost:3000/auth/confirmed_bookings_count')
      .then(result => {
        if (result.data.Status) {
          setConfirmedBookings(result.data.Result[0].total);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const fetchPendingBookingsCount = () => {
    axios.get('http://localhost:3000/auth/pending_bookings_count')
      .then(result => {
        if (result.data.Status) {
          setPendingBookings(result.data.Result[0].total);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleReject = (id, type) => {
    const endpoint = type === 'individual' ? 'reject_confirmed_individual_booking' : 'reject_confirmed_group_booking';
    if (window.confirm('Are you sure you want to reject this booking?')) {
      axios.post(`http://localhost:3000/auth/${endpoint}/${id}`)
        .then(result => {
          if (result.data.Status) {
            fetchConfirmedIndividualBookings();
            fetchConfirmedGroupBookings();
            fetchTotalBookingsCount();
            fetchConfirmedBookingsCount();
            fetchPendingBookingsCount();
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredIndividualBookings = confirmedIndividualBookings.filter(booking => 
    booking.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroupBookings = confirmedGroupBookings.filter(booking => 
    booking.group_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Total Bookings</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{totalBookings}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Confirmed Bookings</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{confirmedBookings}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Pending Bookings</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{pendingBookings}</h5>
          </div>
        </div>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Confirmed Bookings</h3>
        <input 
          type="text" 
          className="form-control mb-3" 
          placeholder="Search by name" 
          value={searchQuery} 
          onChange={handleSearch} 
        />
        <table className='table'>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Booking Name</th>
              <th>Date</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndividualBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.event_name}</td>
                <td>{booking.name}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>Individual</td>
                <td>
                  <Link to={`/dashboard/booking_details/${booking.id}`} className='btn btn-info btn-sm ms-2'>Details</Link>
                  <button className='btn btn-danger btn-sm ms-2' onClick={() => handleReject(booking.id, 'individual')}>Reject</button>
                </td>
              </tr>
            ))}
            {filteredGroupBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.event_name}</td>
                <td>{booking.group_name}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>Group</td>
                <td>
                  <Link to={`/dashboard/booking_details/${booking.id}`} className='btn btn-info btn-sm ms-2'>Details</Link>
                  <button className='btn btn-danger btn-sm ms-2' onClick={() => handleReject(booking.id, 'group')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;





