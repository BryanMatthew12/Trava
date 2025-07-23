import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setHome, selectHome } from "../../slices/home/homeSlice";
import { viewPlace } from "../../api/places/viewPlace";
import { BASE_URL } from "../../config";
import Cookies from "js-cookie";
import Row from "../../components/Row";
import RowSkeleton from "../../skeleton/RowSkeleton";

const RowData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homes = useSelector(selectHome);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${BASE_URL}/v1/places?sort_by=descending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        
        dispatch(setHome(data));
      } catch (error) {
        console.error("Error fetching homes:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, [dispatch]);

  const handleItemClick = async (home) => {
    try {
      await viewPlace(home.id);
    } catch (e) {
      console.error(e);
    }
    navigate(`/PlanningItinerary?source=home&params=${home.id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <RowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!homes || homes.length === 0) {
    return <p>No homes available to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {homes.slice(0, 5).map((home, index) => (
        <Row key={index} data={home} onClick={() => handleItemClick(home)} />
      ))}
    </div>
  );
};

export default RowData;
