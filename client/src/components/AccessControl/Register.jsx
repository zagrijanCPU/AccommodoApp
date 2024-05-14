import React, { useEffect, useState } from "react";
import { baseUrl } from "../../App";
import { Modal, Button } from "react-bootstrap";
import { setErrorMessage, uloge, userExists } from "../Functions";
function Register() {

   const formGroupStyle = {
      margin: '10px'
   }

   const [formData, setFormData] = useState({
      idUloga: 0,
      korisnickoIme: "",
      ime: "",
      prezime: "",
      email: "",
      lozinka: "",
      ponovljenaLozinka: ""
   });
   const [rolesArray, setRolesArray] = useState([]);
   const [redirectToLogin, setRedirectToLogin] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const setRoles = async () => {
      setRolesArray(await uloge());
   }

   useEffect(() => {
      setRoles();
   }, []);

   const validation = () => {
      if (
         formData.idUloga == 0 ||
         formData.ime == "" ||
         formData.prezime == "" ||
         formData.korisnickoIme == "" ||
         formData.email == "" ||
         formData.lozinka == "" ||
         formData.ponovljenaLozinka == ""
      ) {
         setErrorMessage(true, "All fields required!");
         return false;
      }

      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(formData.email)) {
         setErrorMessage(true, "Email format: example@example.com!");
         return false;
      }

      if (formData.lozinka.length < 8) {
         setErrorMessage(true, "Password length min. 8 characters!");
         return false;
      }

      return true;
   };

   const checkEmailFormat = (event) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(event.target.value)) {
         document.getElementById('email').style.border = "1px solid red";
      }
      else {
         document.getElementById('email').style.border = "1px solid green";
      }
   }

   const checkRepeatedPassword = (event) => {
      if (formData.lozinka != event.target.value) {
         document.getElementById('ponovljenaLozinka').style.border = "1px solid red";
      }
      else {
         document.getElementById('ponovljenaLozinka').style.border = "1px solid green";
      }
   }

   const handleSubmit = async (event) => {
      event.preventDefault();
      if (!validation()) {
         return;
      }

      if (await userExists(formData.korisnickoIme, formData.email)) {
         setRedirectToLogin(true);
         return;
      }

      const data = formData;
      console.log(data);
      const response = await fetch(`${baseUrl}/api/register/`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      setShowSuccessModal(true);
   };

   return (
      <div className="container mt-5">
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card">
                  <div className="card-header">
                     <h4>Register form</h4>
                  </div>
                  {redirectToLogin ? (
                     <>
                        <div className="card-body">
                           <p>
                              Account with this username or email already exists.
                           </p>
                           <div className="row justify-content-center">
                              <div className="col text-center">
                                 <a href="/login" className="btn btn-primary">
                                    Login
                                 </a>
                              </div>
                              <div className="col text-center">
                                 <a href="/register" className="btn btn-primary">
                                    Register
                                 </a>
                              </div>
                           </div>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="card-body">
                           <div className="error-message"></div>
                           <form onSubmit={handleSubmit} method="post">
                              <div className="form-group" style={formGroupStyle}>
                                 <label htmlFor="uloga">Choose role</label>
                                 <select
                                    name="uloga"
                                    id="uloga"
                                    className="form-control"
                                    value={formData.idUloga}
                                    onChange={(e) => {
                                       setFormData({ ...formData, idUloga: e.target.value });
                                       setErrorMessage(false);
                                    }}
                                 >
                                    <option value="">--</option>
                                    {rolesArray.map((element) => (
                                       <option key={element.iduloga} value={element.iduloga}>
                                          {element.nazuloga}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                              <div className="form-group" style={formGroupStyle}>
                                 <label htmlFor="ime">Name</label>
                                 <input
                                    type="text"
                                    className="form-control"
                                    id="ime"
                                    value={formData.ime}
                                    onChange={(e) => {
                                       setFormData({ ...formData, ime: e.target.value });
                                       setErrorMessage(false);
                                    }}
                                 />
                              </div>
                              <div className="form-group" style={formGroupStyle}>
                                 <label htmlFor="prezime">Surname</label>
                                 <input
                                    type="text"
                                    className="form-control"
                                    id="prezime"
                                    value={formData.prezime}
                                    onChange={(e) => {
                                       setFormData({ ...formData, prezime: e.target.value });
                                       setErrorMessage(false);
                                    }}
                                 />
                              </div>
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
                                 <label htmlFor="email">Email</label>
                                 <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                       setFormData({ ...formData, email: e.target.value });
                                       setErrorMessage(false);
                                       checkEmailFormat(e);
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
                                       document.getElementById('ponovljenaLozinka').style.border = "1px solid red";
                                    }}
                                 />
                              </div>
                              <div className="form-group" style={formGroupStyle}>
                                 <label htmlFor="lozinka">Repeat password</label>
                                 <input
                                    type="password"
                                    className="form-control"
                                    id="ponovljenaLozinka"
                                    value={formData.ponovljenaLozinka}
                                    onChange={(e) => {
                                       setFormData({ ...formData, ponovljenaLozinka: e.target.value });
                                       checkRepeatedPassword(e);
                                    }}
                                 />
                              </div>
                              <div className="form-group" style={formGroupStyle}>
                                 <input type="submit" className="btn btn-primary" value="Register" />
                              </div>
                           </form>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>
         {/* Modal koji će se prikazati nakon uspješne registracije */}
         <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Successfully registration</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your account is registrated.</Modal.Body>
            <Modal.Footer>
               <a className="btn btn-primary" href="/login">
                  Login
               </a>
            </Modal.Footer>
         </Modal>
      </div>
   );
}

export default Register;
