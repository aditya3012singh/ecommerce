import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type DecodedToken = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  exp: number;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null); // You can type this properly if needed
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setUser(decoded);

          // Now safely use decoded.id
          const response = await axios.get(`http://localhost:3000/api/v1/user/${decoded.id}`);
          setUserDetails(response.data);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
        <div className="text-lg space-y-2">
          <p><strong>Name:</strong> {userDetails?.name || user.name || "N/A"}</p>
          <p><strong>Email:</strong> {userDetails?.email || user.email || "N/A"}</p>
          <p><strong>Role:</strong> {userDetails?.role || user.role || "User"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
