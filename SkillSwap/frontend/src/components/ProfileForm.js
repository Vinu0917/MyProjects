import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skillsCanTeach, setSkillsCanTeach] = useState("");
  const [skillsWantToLearn, setSkillsWantToLearn] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/create", {
        name,
        email,
        skillsCanTeach: skillsCanTeach.split(",").map(s => s.trim()),
        skillsWantToLearn: skillsWantToLearn.split(",").map(s => s.trim())
      });
      navigate(`/matches/${res.data.user._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Create Profile</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Skills you can teach (comma separated)" value={skillsCanTeach} onChange={e => setSkillsCanTeach(e.target.value)} /><br />
      <input placeholder="Skills you want to learn (comma separated)" value={skillsWantToLearn} onChange={e => setSkillsWantToLearn(e.target.value)} /><br />
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default ProfileForm;
