import React, { useEffect, useRef, useState } from "react";
import { baseUrl, getImageSource, role, storedToken } from "../../App";
import { Modal } from "react-bootstrap";
import { format } from 'date-fns';

const ChangeData = (props) => {
   const requestTypeId = props.requestTypeId;
   const formGroupStyle = {
      margin: '10px'
   }

   const [accommodations, setAccommodations] = useState([]);
   const [userId, setUserId] = useState("");
   const [currentPage, setCurrentPage] = useState(0);
   const [pageCount, setPageCount] = useState(0);
   const [pageSize, setPageSize] = useState(5);
   const [loading, setLoading] = useState(true);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const fileInputRef = useRef(null);
   const [newImage, setNewImage] = useState(null);


   const [accommodation, setAccommodation] = useState({
      idsmjestaj: 0,
      idtipsmjestaja: 0,
      naztipasmjestaja: "",
      nazivsmjestaja: "",
      drzava: "",
      grad: "",
      adresa: "",
      postanskibroj: "",
      cijena: "",
      kapacitet: "",
      brojparkirnihmjesta: "",
      profilnaslika: ""
   });

   const getAccommodations = async () => {
      try {
         if (storedToken) {
            const response = await fetch(`${baseUrl}/api/data/getAccommodations?page=${currentPage + 1}&pageSize=${pageSize}`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               },
               body: JSON.stringify({ role })
            });

            if (response.ok) {
               const data = await response.json();
               console.log(data);
               setAccommodations(data.accommodations);
               setPageCount(Math.ceil(data.totalCount / pageSize));
            }
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      finally {
         setLoading(false);
      }
   }

   const getUserId = async () => {
      if (storedToken) {
         const response = await fetch(`${baseUrl}/api/data/getUserId`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setUserId(data.toString());
         }
      }
   }

   useEffect(() => {
      getAccommodations();
      getUserId();
   }, []);

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

   const getAccommodation = async (accommodationId) => {
      try {
         const response = await fetch(`${baseUrl}/api/data/getAccommodation?id=${accommodationId}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         if (response.ok) {
            const data = await response.json();
            console.log(data);
            setAccommodation(data);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   const fillEditModal = (accommodationId) => {
      getAccommodation(accommodationId);
   }

   const validation = () => {
      if (
         accommodation.nazivsmjestaja == "" ||
         accommodation.adresa == "" ||
         accommodation.cijena == "" ||
         accommodation.kapacitet == "" ||
         accommodation.brojparkirnihmjesta == "" ||
         accommodation.profilnaslika == null
      ) {
         setErrorMessage(true, "All fields are required!");
         return false;
      }

      return true;
   }

   const handleChangeData = async () => {
      console.log(accommodation);
      if (!validation()) {
         return;
      }
      
      const formData = new FormData();
      formData.append('idVrstaZahtjeva', requestTypeId);
      formData.append('idVlasnik', userId);
      formData.append('idSmjestaj', accommodation.idsmjestaj);
      formData.append('idTipSmjestaja', accommodation.idtipsmjestaja);
      formData.append('nazivSmjestaja', accommodation.nazivsmjestaja);
      formData.append('drzava', accommodation.drzava);
      formData.append('grad', accommodation.grad);
      formData.append('adresa', accommodation.adresa);
      formData.append('postanskiBroj', accommodation.postanskibroj);
      formData.append('cijena', accommodation.cijena);
      formData.append('kapacitet', accommodation.kapacitet);
      formData.append('brojParkirnihMjesta', accommodation.brojparkirnihmjesta);
      
      // Ovo samo služi ako nisam birao neku sliku kao File, nego šaljem staru sliku (moram poslati cijeli Buffer)
      if (accommodation.profilnaslika.type == "Buffer") {
         formData.append('profilnaSlika', new Blob([new Uint8Array(accommodation.profilnaslika.data)]));
      }
      else {
         formData.append('profilnaSlika', accommodation.profilnaslika);
      }

      try {
         const response = await fetch(`${baseUrl}/api/data/changeDataRequest`, {
            method: 'POST',
            body: formData
         });
         
         if (response.ok) {
            console.log("ovdje");
            setShowSuccessModal(true);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   return (
      <div className="container mt-5">
         <div className="d-flex justify-content-start flex-wrap gap-5">
            {
               accommodations.map(item => (
                  <div key={item.idsmjestaj} className="card" style={{ width: "300px" }}>
                     <img className="card-img-top" src={getImageSource(item.profilnaslika)} alt="Card image" style={{ width: "100%" }} />
                     <div className="card-body">
                        <h4 className="card-title">{item.nazivsmjestaja}</h4>
                        <p className="card-text">Accommodation Type: {item.naztipasmjestaja}</p>
                        <a onClick={() => {
                           setShowEditModal(true);
                           setNewImage(null);
                           fillEditModal(item.idsmjestaj);
                        }} className="btn btn-primary">Edit</a>
                     </div>
                  </div>
               ))
            }
         </div>
         <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Edit Accommodation Data</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
               <div className="container">
                  <div className="error-message"></div>
                  <div className="form-group">
                     <label htmlFor="profilnaSlika">(Click to change image)</label>
                     <img
                        src={newImage || getImageSource(accommodation.profilnaslika)}
                        alt="image"
                        style={{ width: "100%", cursor: "pointer" }}
                        onClick={() => {
                           if (fileInputRef.current) {
                              fileInputRef.current.click();
                           }
                        }}
                     />
                     <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={(e) => {
                           const files = e.target.files;
                           if (files && files.length > 0) {
                              const file = files[0];
                              const imageUrl = URL.createObjectURL(file);
                              setNewImage(imageUrl);
                              setAccommodation({ ...accommodation, profilnaslika: file });
                              console.log(file);
                              console.log(files);
                           }
                        }}
                     />
                  </div>
                  <div className="form-group" style={formGroupStyle}>
                     <label htmlFor="nazivSmjestaja">Accommodation name</label>
                     <input
                        type="text"
                        className="form-control"
                        id="nazivSmjestaja"
                        value={accommodation.nazivsmjestaja}
                        onChange={(e) => {
                           setAccommodation({ ...accommodation, nazivsmjestaja: e.target.value });
                           setErrorMessage(false);
                        }}
                     />
                  </div>
                  <div className='form-group' style={formGroupStyle}>
                     <label htmlFor="adresa">Address</label>
                     <input
                        type="text"
                        className='form-control'
                        id='adresa'
                        value={accommodation.adresa}
                        onChange={(e) => {
                           setAccommodation({ ...accommodation, adresa: e.target.value });
                           setErrorMessage(false);
                        }}
                     />
                  </div>
                  <div className='form-group' style={formGroupStyle}>
                     <label htmlFor="cijena">Price (€)</label>
                     <input
                        type="number"
                        step="0.01"
                        min="0"
                        className='form-control'
                        id='cijena'
                        value={accommodation.cijena}
                        onChange={(e) => {
                           setAccommodation({ ...accommodation, cijena: e.target.value });
                           setErrorMessage(false);
                        }}
                     />
                  </div>
                  <div className='form-group' style={formGroupStyle}>
                     <label htmlFor="kapacitet">Capacity</label>
                     <input
                        type="number"
                        step="1"
                        min="1"
                        className='form-control'
                        id='kapacitet'
                        value={accommodation.kapacitet}
                        onChange={(e) => {
                           setAccommodation({ ...accommodation, kapacitet: e.target.value });
                           if (e.target.value > 0) {
                              setErrorMessage(false);
                           }
                           else {
                              setErrorMessage(true, "Capacity needs to be at least 1.")
                           }
                        }}
                     />
                  </div>
                  <div className='form-group' style={formGroupStyle}>
                     <label htmlFor="brojParkirnihMjesta">Number of parking spots</label>
                     <input
                        type="number"
                        step="1"
                        min="0"
                        className='form-control'
                        id='brojParkirnihMjesta'
                        value={accommodation.brojparkirnihmjesta}
                        onChange={(e) => {
                           setAccommodation({ ...accommodation, brojparkirnihmjesta: e.target.value });
                           if (e.target.value >= 0) {
                              setErrorMessage(false);
                           }
                           else {
                              setErrorMessage(true, "Number of parking spots needs to be at least 0.")
                           }
                        }}
                     />
                  </div>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <a className="btn btn-primary" onClick={handleChangeData}>
                  Send
               </a>
            </Modal.Footer>
         </Modal>

         <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your accommodation added to requests.</Modal.Body>
            <Modal.Footer>
               <a className="btn btn-primary" href="/">
                  Home
               </a>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default ChangeData;