import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";

const router = express.Router();

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Admin login
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token);
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/admin_records', (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error" + err});
        return res.json({Status: true, Result: result});
    });
});

// Bookings Routes
router.get('/bookings', (req, res) => {
  const status = req.query.status || 'all';
  let sql = "SELECT * FROM bookings";
  
  if (status !== 'all') {
      sql += " WHERE status = ?";
      con.query(sql, [status], (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query Error: " + err.message });
          return res.json({ Status: true, Result: result });
      });
  } else {
      con.query(sql, (err, result) => {
          if (err) return res.json({ Status: false, Error: "Query Error: " + err.message });
          return res.json({ Status: true, Result: result });
      });
  }
});




router.post('/add_booking', upload.single('image'), (req, res) => {
  const { event_name, location, date, capacity, event_id } = req.body;

  // Check if event_id is provided
  if (!event_id) {
      return res.json({ Status: false, Error: "Event ID cannot be null." });
  }

  const sql = "INSERT INTO bookings (event_name, location, date, capacity, image, status, event_id) VALUES (?)";
  const values = [event_name, location, date, capacity, req.file ? req.file.filename : null, 'pending', event_id];
  con.query(sql, [values], (err, result) => {
      if (err) {
          console.error('Error adding booking:', err.message);
          return res.json({ Status: false, Error: "Query Error: " + err.message });
      }
      return res.json({ Status: true });
  });
});


router.post('/update_booking_status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status can be 'confirmed', 'rejected'

  const sql = `UPDATE bookings SET status = ? WHERE id = ?`;
  con.query(sql, [status, id], (err, result) => {
      if (err) {
          console.error('Error updating booking status:', err.message);
          return res.json({ Status: false, Error: "Query Error: " + err.message });
      }
      return res.json({ Status: true });
  });
});


router.put('/edit_booking/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const { event_name, location, date, capacity } = req.body;
  const sql = "UPDATE bookings SET event_name = ?, location = ?, date = ?, capacity = ?, image = ? WHERE id = ?";
  const values = [event_name, location, date, capacity, req.file ? req.file.filename : req.body.existingImage, id];
  con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error: " + err.message });
      return res.json({ Status: true });
  });
});

router.delete('/delete_booking/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM bookings WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true });
    });
});

// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: true});
});


router.get('/events', (req, res) => {
    const sql = "SELECT * FROM bookings"; // Ensure this is your correct table name
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});



router.post('/register', (req, res) => {
    const { event_id, type, participants, institution, poc_name, poc_contact, poc_email, special_requirements } = req.body;
    const sql = "INSERT INTO registrations (event_id, type, participants, institution, poc_name, poc_contact, poc_email, special_requirements) VALUES (?)";
    const values = [event_id, type, participants, institution, poc_name, poc_contact, poc_email, special_requirements];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true });
    });
});


router.post('/add_event', upload.single('image'), (req, res) => {
    const { event_name, location, date, capacity, description } = req.body;
    const sql = "INSERT INTO events (event_name, location, date, capacity, description, image) VALUES (?)";
    const values = [event_name, location, date, capacity, description, req.file ? req.file.filename : null];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true });
    });
});


// Function to format date to YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};
// Register individual booking
router.post('/register_individual', (req, res) => {
    const { event_id, name, email, phone, special_requirements } = req.body;
    const date = new Date(); // Or use the event date from the event table if available
  
    const sql = `INSERT INTO IndividualBookings (event_id, name, email, phone, date, special_requirements) VALUES (?, ?, ?, ?, ?, ?)`;
    con.query(sql, [event_id, name, email, phone, date, special_requirements], (err, result) => {
      if (err) {
        console.log("Error registering individual booking:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true });
    });
  });
  
  // Register group booking
  router.post('/register_group', (req, res) => {
    const { event_id, group_name, participants, contact_name, contact_email, contact_phone, special_requirements } = req.body;
    const date = new Date(); // Or use the event date from the event table if available
  
    const sql = `INSERT INTO GroupBookings (event_id, group_name, participants, contact_name, contact_email, contact_phone, date, special_requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    con.query(sql, [event_id, group_name, participants, contact_name, contact_email, contact_phone, date, special_requirements], (err, result) => {
      if (err) {
        console.log("Error registering group booking:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true });
    });
  });

// Fetch event details
router.get('/bookings/:id', (req, res) => {
    const sql = `SELECT id, event_name, date FROM Bookings WHERE id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error fetching event details:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Event details fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  

// Fetch individual booking details
router.get('/individual_booking/:id', (req, res) => {
  const sql = `SELECT ib.id, b.event_name, ib.name, ib.email, ib.phone, ib.date, ib.special_requirements
               FROM IndividualBookings ib
               JOIN Bookings b ON ib.event_id = b.id
               WHERE ib.id = ?`;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("Error fetching individual booking details:", err.message);
      return res.json({ Status: false, Error: err.message });
    }
    console.log("Individual booking details fetched:", result);
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0], Type: 'individual' });
    } else {
      return res.json({ Status: false, Error: "No individual booking found" });
    }
  });
});
  
  
 
// Fetch group booking details
router.get('/group_booking/:id', (req, res) => {
  const sql = `SELECT gb.id, b.event_name, gb.group_name, gb.participants, gb.contact_name, gb.contact_email, gb.contact_phone, gb.date, gb.special_requirements
               FROM GroupBookings gb
               JOIN Bookings b ON gb.event_id = b.id
               WHERE gb.id = ?`;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("Error fetching group booking details:", err.message);
      return res.json({ Status: false, Error: err.message });
    }
    console.log("Group booking details fetched:", result);
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0], Type: 'group' });
    } else {
      return res.json({ Status: false, Error: "No group booking found" });
    }
  });
});


  // Confirm group booking
  router.post('/confirm_group_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE GroupBookings SET status = 'confirmed' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
  });
  
  // Reject individual booking
  router.post('/reject_individual_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE IndividualBookings SET status = 'rejected' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
  });
  
  // Reject group booking
  router.post('/reject_group_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE GroupBookings SET status = 'rejected' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
  })


  router.get('/all_bookings', (req, res) => {
    const individualBookingsSql = `SELECT id, event_name, name AS requester_name, date, 'individual' AS type FROM IndividualBookings`;
    const groupBookingsSql = `SELECT id, event_name, group_name AS requester_name, date, 'group' AS type FROM GroupBookings`;
  
    con.query(individualBookingsSql, (err, individualResults) => {
      if (err) return res.json({ Status: false, Error: err.message });
  
      con.query(groupBookingsSql, (err, groupResults) => {
        if (err) return res.json({ Status: false, Error: err.message });
  
        const allBookings = [...individualResults, ...groupResults];
        return res.json({ Status: true, Result: allBookings });
      });
    });
  });
  
 // Fetch individual booking details
router.get('/individual_booking/:id', (req, res) => {
    const sql = `SELECT ib.id, b.event_name, ib.name, ib.email, ib.phone, ib.date, ib.special_requirements
                 FROM IndividualBookings ib
                 JOIN Bookings b ON ib.event_id = b.id
                 WHERE ib.id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error fetching individual booking details:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Individual booking details fetched:", result);
      return res.json({ Status: true, Result: result[0], Type: 'individual' });
    });
  });
  
  // Fetch group booking details
  router.get('/group_booking/:id', (req, res) => {
    const sql = `SELECT gb.id, b.event_name, gb.group_name, gb.participants, gb.contact_name, gb.contact_email, gb.contact_phone, gb.date, gb.special_requirements
                 FROM GroupBookings gb
                 JOIN Bookings b ON gb.event_id = b.id
                 WHERE gb.id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error fetching group booking details:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Group booking details fetched:", result);
      return res.json({ Status: true, Result: result[0], Type: 'group' });
    });
  });

// Fetch individual booking details
router.get('/individual_booking_details/:id', (req, res) => {
    const sql = `SELECT * FROM IndividualBookings WHERE id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error fetching individual booking details:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Individual booking details fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch group booking details
  router.get('/group_booking_details/:id', (req, res) => {
    const sql = `SELECT * FROM GroupBookings WHERE id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error fetching group booking details:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Group booking details fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  

  // Fetch pending bookings
  router.get('/pending_bookings', (req, res) => {
    const sql = `SELECT * FROM Bookings WHERE status = 'pending'`;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching pending bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Confirm booking
  router.post('/confirm_booking/:id', (req, res) => {
    const sql = `UPDATE Bookings SET status = 'confirmed' WHERE id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error confirming booking:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true });
    });
  });
  
  // Reject booking
  router.post('/reject_booking/:id', (req, res) => {
    const sql = `UPDATE Bookings SET status = 'rejected' WHERE id = ?`;
    con.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log("Error rejecting booking:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true });
    });
  });

  // Fetch pending individual bookings
router.get('/pending_individual_bookings', (req, res) => {
    const sql = `
      SELECT i.id, b.event_name, i.name, i.date, i.status 
      FROM IndividualBookings i
      JOIN Bookings b ON i.event_id = b.id
      WHERE i.status = 'pending'
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching pending individual bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Pending individual bookings fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch pending group bookings
  router.get('/pending_group_bookings', (req, res) => {
    const sql = `
      SELECT g.id, b.event_name, g.group_name, g.date, g.participants, g.status 
      FROM GroupBookings g
      JOIN Bookings b ON g.event_id = b.id
      WHERE g.status = 'pending'
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching pending group bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Pending group bookings fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch total bookings count
router.get('/total_bookings_count', (req, res) => {
    const sql = `
      SELECT COUNT(*) AS total FROM (
        SELECT id FROM IndividualBookings
        UNION ALL
        SELECT id FROM GroupBookings
      ) AS total_bookings
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching total bookings count:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch confirmed bookings count
  router.get('/confirmed_bookings_count', (req, res) => {
    const sql = `
      SELECT COUNT(*) AS total FROM (
        SELECT id FROM IndividualBookings WHERE status = 'confirmed'
        UNION ALL
        SELECT id FROM GroupBookings WHERE status = 'confirmed'
      ) AS confirmed_bookings
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching confirmed bookings count:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch pending bookings count
  router.get('/pending_bookings_count', (req, res) => {
    const sql = `
      SELECT COUNT(*) AS total FROM (
        SELECT id FROM IndividualBookings WHERE status = 'pending'
        UNION ALL
        SELECT id FROM GroupBookings WHERE status = 'pending'
      ) AS pending_bookings
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching pending bookings count:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch confirmed bookings
  router.get('/confirmed_bookings', (req, res) => {
    const sql = `SELECT 'individual' as type, id, event_name, name as booker_name, date, 1 as participants FROM IndividualBookings WHERE status = 'confirmed'
                 UNION ALL
                 SELECT 'group' as type, id, event_name, group_name as booker_name, date, participants FROM GroupBookings WHERE status = 'confirmed'`;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching confirmed bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Confirm individual booking
  router.post('/confirm_individual_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE IndividualBookings SET status = 'confirmed' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
  });
  
  // Confirm group booking
  router.post('/confirm_group_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE GroupBookings SET status = 'confirmed' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
  });
export { router as adminRouter };

// Fetch confirmed individual bookings
router.get('/confirmed_individual_bookings', (req, res) => {
    const sql = `
      SELECT i.id, b.event_name, i.name, i.date, i.status 
      FROM IndividualBookings i
      JOIN Bookings b ON i.event_id = b.id
      WHERE i.status = 'confirmed'
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching confirmed individual bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Confirmed individual bookings fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  
  // Fetch confirmed group bookings
  router.get('/confirmed_group_bookings', (req, res) => {
    const sql = `
      SELECT g.id, b.event_name, g.group_name, g.date, g.participants, g.status 
      FROM GroupBookings g
      JOIN Bookings b ON g.event_id = b.id
      WHERE g.status = 'confirmed'
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log("Error fetching confirmed group bookings:", err.message);
        return res.json({ Status: false, Error: err.message });
      }
      console.log("Confirmed group bookings fetched:", result);
      return res.json({ Status: true, Result: result });
    });
  });
  
// Reject confirmed individual booking
router.post('/reject_confirmed_individual_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE IndividualBookings SET status = 'rejected' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true });
    });
});

// Reject confirmed group booking
router.post('/reject_confirmed_group_booking/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE GroupBookings SET status = 'rejected' WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true });
    });
});