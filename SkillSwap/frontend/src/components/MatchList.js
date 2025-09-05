import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MatchList = () => {
  const { userId } = useParams();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await axios.get(`http://localhost:5000/api/matches/matches/${userId}`);
      setMatches(res.data);
    };
    fetchMatches();
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Matches</h2>
      {matches.length === 0 ? <p>No matches found.</p> : (
        <ul>
          {matches.map(match => (
            <li key={match._id}>{match.name} - Can teach: {match.skillsCanTeach.join(", ")}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchList;
