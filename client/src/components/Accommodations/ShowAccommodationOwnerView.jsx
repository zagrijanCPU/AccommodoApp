import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { getAccommodation, setErrorMessage } from "../Functions";
import { baseUrl, getImageSource, storedToken } from "../../App";
import { useParams } from "react-router-dom";
import CustomCalendar from "../Calendars/CustomCalendar";
import ViewRatings from "../Ratings/ViewRatings";

const ShowAccommodationOwnerView = (props) => {
   var { id } = useParams();
   id = parseInt(id);

   const accommodation = props.accommodation;
   const requestTypeId = props.requestTypeId;
   const setAccommodation = props.setAccommodation;
   const userId = props.userId;
   const intervals = props.intervals;
   const fileInputRef = useRef(null);
   const formGroupStyle = {
      margin: '10px'
   }
   const [newImage, setNewImage] = useState(null);
   const [editData, setEditData] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [authorized, setAuthorized] = useState(false);


   const checkOwner = () => {
      if (accommodation.idvlasnik == userId) {
         setAuthorized(true);
      }
   }

   useEffect(() => {
      checkOwner();
   }, []);

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
            setShowSuccessModal(true);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   const eraseEditForm = () => {
      setNewImage(null);
   }

   return (
      <>
         {
            authorized ?
               <div className="container" style={{ marginTop: "30px" }}>
                  <div className="error-message"></div>
                  <div className="form-group">
                     <img
                        src={newImage || getImageSource(accommodation.profilnaslika)}
                        alt="image"
                        style={{ width: "300px", cursor: "pointer" }}
                        disabled={editData}
                        className="form-control"
                        onClick={() => {
                           if (fileInputRef.current) {
                              fileInputRef.current.click();
                           }
                        }}
                     />
                     <label htmlFor="profilnaSlika">
                        {editData && "(Click to change image)"}
                     </label>
                     <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        className="form-control"
                        disabled={!editData ? true : false}
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
                        disabled={!editData ? true : false}
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
                        disabled={!editData ? true : false}
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
                        disabled={!editData ? true : false}
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
                        disabled={!editData ? true : false}
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
                        disabled={!editData ? true : false}
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
                  <div className="form-group" style={formGroupStyle}>
                     {editData && <a className="btn btn-primary" style={{ marginRight: "10px" }} onClick={handleChangeData}>Submit</a>}
                     {editData && <a className="btn btn-secondary" onClick={async () => {
                        setEditData(false);
                        setAccommodation(await getAccommodation(id));
                        eraseEditForm();
                     }}>Cancel</a>}
                     {!editData && <a className="btn btn-primary" onClick={() => {
                        setEditData(true);
                     }}>Edit</a>}

                     <CustomCalendar intervals={intervals} />
                     <ViewRatings idsmjestaj={accommodation.idsmjestaj} />
                  </div>
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
               :
               <p>
                  You don't have permission to see this page.
               </p>
         }
      </>
   );
}

export default ShowAccommodationOwnerView;