import { Route, Routes, Navigate } from "react-router-dom";

import Signup from "./Pages/Singup/index"; // Fix spelling from "Singup" to "Signup"
import Login from "./Pages/Login";
import Home from "./Pages/Home/Home";
import Addlocation from "./Pages/Addlocation/Addlocation";
import AboutPage from "./Pages/About/AboutPage";
import ClassesPage from "./Pages/Classes/ClassesPage";
import VideoCall from "./Pages/Session/VideoCall";
import ContactUs from "./Pages/Contact/ContactUs";
import YogaDetailPage from "./Pages/Home/YogaDetailPage.jsx";

function App() {
  const user = localStorage.getItem("token");
  console.log(user);
  

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/Home" />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/addlocation" element={<Addlocation />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/schedule" element={<VideoCall />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/yoga/:id" element={<YogaDetailPage />} />




  
    </Routes>
  );
}

export default App;
