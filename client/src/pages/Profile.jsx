// client/src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import axios from "../http";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return user ? (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Birth Date: {user.birth_date}</p>
      <p>School: {user.school}</p>
      <p>Bio: {user.bio}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;
