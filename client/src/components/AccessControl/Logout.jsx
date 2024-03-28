import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
   const navigate = useNavigate();

   useEffect(() => {
      sessionStorage.removeItem("token");
      navigate("/");
      window.location.reload();
   }, [])
}

export default Logout;