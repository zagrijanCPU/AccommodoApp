import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../App";
import { Modal, Button } from "react-bootstrap";

function Login() {

   const formGroupStyle = {
      margin: '10px'
   }

   const [formData, setFormData] = useState({
      korisnickoIme: "",
      lozinka: ""
   });
   const navigate = useNavigate();
   
   const setErrorMessage = (error, message) => {
      if (error) {
         var errorMessage = document.querySelector(".error-message");
         errorMessage.innerHTML = message;
         errorMessage.style.color = "red";
      } else {
         var errorMessage = document.querySelector(".error-message");
         errorMessage.innerHTML = "";
      }
   };

   const validation = () => {
      if (
         formData.korisnickoIme == "" ||
         formData.lozinka == ""
      ) {
         setErrorMessage(true, "All fields required!");
         return false;
      }
      return true;
   }

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!validation()) {
         return
      }

      try {
         const response = await fetch(`${baseUrl}/api/login`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         })
   
         if (response.ok) {
            const data = await response.text();
            // console.log(data);
            sessionStorage.setItem("token", data);
            navigate("/");
            window.location.reload();
         }
         else {
            const message = await response.json();
            setErrorMessage(true, message.message);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   return (
      <div className="container mt-5">
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card">
                  <div className="card-header">
                     <h4>Login form</h4>
                  </div>
                  <div className="card-body">
                     <div className="error-message"></div>
                     <form onSubmit={handleSubmit} method="post">
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="korisnickoIme">Username</label>
                           <input
                              type="text"
                              className="form-control"
                              id="korisnickoIme"
                              value={formData.korisnickoIme}
                              onChange={(e) => {
                                 setFormData({
                                    ...formData,
                                    korisnickoIme: e.target.value,
                                 });
                                 setErrorMessage(false);
                              }}
                           />
                        </div>
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="lozinka">Password</label>
                           <input
                              type="password"
                              className="form-control"
                              id="lozinka"
                              value={formData.lozinka}
                              onChange={(e) => {
                                 setFormData({ ...formData, lozinka: e.target.value });
                                 setErrorMessage(false);
                              }}
                           />
                        </div>
                        <div className="form-group" style={formGroupStyle}>
                           <input type="submit" className="btn btn-primary" value="Login"/>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Login;
