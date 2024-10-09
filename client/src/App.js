import { Route, Routes, Navigate } from "react-router-dom";

import Signup from "./Pages//Singup/index"; // Fix spelling from "Singup" to "Signup"
import Login from "./Pages/Login";
import Home from "./Pages/Home/Home";
import Addlocation from "./Pages/Addlocation/Addlocation";

function App() {
  const user = localStorage.getItem("token");
  console.log(user);
  

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate replace to="/Home" /> : <Navigate replace to="/login" />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />


          <Route path="/Home" element={<Home />} />
          <Route path="/addlocation" element={<Addlocation />} />


  
    </Routes>
  );
}

export default App;
