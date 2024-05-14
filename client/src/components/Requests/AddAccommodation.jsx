import React, { useEffect, useState } from 'react';
import { baseUrl, storedToken } from '../../App';
import { Modal } from 'react-bootstrap';
import { getAccommodationTypes, getUserId, setErrorMessage } from '../Functions';

const AddAccommodation = (props) => {

   const requestTypeId = props.requestTypeId;

   const formGroupStyle = {
      margin: '10px'
   }

   const [accommodationTypesArray, setAccommodationTypesArray] = useState([]);
   const [userId, setUserId] = useState("");
   const [accommodationTypeId, setAccommodationTypeId] = useState("");
   const [accommodationName, setAccommodationName] = useState("");
   const [country, setCountry] = useState("");
   const [city, setCity] = useState("");
   const [postalNumber, setPostalNumber] = useState("");
   const [address, setAddress] = useState("");
   const [price, setPrice] = useState("");
   const [capacity, setCapacity] = useState("");
   const [numberOfParkingSpots, setNumberOfParkingSpots] = useState("");
   const [categorization, setCategorization] = useState("");
   const [ownershipCertificate, setOwnershipCertificate] = useState("");
   const [profilePicture, setProfilePicture] = useState("");
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const getData = async () => {
      var data = await getAccommodationTypes();
      if (data) {
         setAccommodationTypesArray(data);
      }

      data = await getUserId();
      if (data) {
         setUserId(data.toString());
      }
   }

   useEffect(() => {
      getData();
   }, [])

   const validation = () => {
      if (accommodationTypeId == 0 ||
         accommodationName == "" ||
         country == "" ||
         city == "" ||
         address == "" ||
         postalNumber == "" ||
         price == "" ||
         capacity == "" ||
         numberOfParkingSpots == "" ||
         categorization == "" ||
         ownershipCertificate == ""
      ) {
         setErrorMessage(true, "All fields are required!");
         return false;
      }

      return true;
   }

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!validation()) {
         return;
      }
      
      const formData = new FormData();
      formData.append('idVrstaZahtjeva', requestTypeId);
      formData.append('idVlasnik', userId);
      formData.append('idTipSmjestaja', accommodationTypeId);
      formData.append('nazivSmjestaja', accommodationName);
      formData.append('drzava', country);
      formData.append('grad', city);
      formData.append('adresa', address);
      formData.append('postanskiBroj', postalNumber);
      formData.append('cijena', price);
      formData.append('kapacitet', capacity);
      formData.append('brojParkirnihMjesta', numberOfParkingSpots);
      formData.append('profilnaSlika', profilePicture);
      formData.append('kategorizacija', categorization);
      formData.append('vlasnickiList', ownershipCertificate);

      try {
         const response = await fetch(`${baseUrl}/api/data/addAccommodationRequest`, {
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
   };


   return (
      <div className='container mt-5'>
         <div className='row justify-content-start'>
            <div className="col-md-6">
               <div className="card">
                  <div className="card-header">
                     <h4>Add Accommodation</h4>
                  </div>
                  <div className='card-body'>
                     <div className="error-message"></div>
                     <form onSubmit={handleSubmit} method="post">
                        <div className='form-group' style={formGroupStyle}>
                           <label htmlFor="profilnaSlika">Select photo</label>
                           <input
                              type="file"
                              id="coverImage"
                              name="coverImage"
                              accept="image/*"
                              className="form-control"
                              onChange={(e) => {
                                 const files = e.target.files;
                                 if (files && files.length > 0) {
                                    const file = files[0];
                                    setProfilePicture(file);
                                    console.log(file);
                                    console.log(files);
                                 }
                              }}
                           />
                        </div>
                        <div className='form-group'>
                           <label htmlFor="kategorizacija">Categorization</label>
                           <input
                              type="file"
                              id='kategorizacija'
                              name='kategorizacija'
                              accept='.pdf'
                              className='form-control'
                              onChange={(e) => {
                                 const files = e.target.files;
                                 if (files && files.length > 0) {
                                    const file = files[0];
                                    setCategorization(file);
                                    console.log(file);
                                    console.log(files);
                                 }
                              }}
                           />
                        </div>
                        <div className='form-group'>
                           <label htmlFor="vlasnickiList">Ownership Certificate</label>
                           <input
                              type="file"
                              id='vlasnickiList'
                              name='vlasnickiList'
                              accept='.pdf'
                              className='form-control'
                              onChange={(e) => {
                                 const files = e.target.files;
                                 if (files && files.length > 0) {
                                    const file = files[0];
                                    setOwnershipCertificate(file);
                                    console.log(file);
                                    console.log(files);
                                 }
                              }}
                           />
                        </div>
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="tipSmjestaja">Choose accommodation type</label>
                           <select
                              name="tipSmjestaja"
                              id="tipSmjestaja"
                              className='form-control'
                              value={accommodationTypeId}
                              onChange={(e) => {
                                 setAccommodationTypeId(e.target.value);
                                 setErrorMessage(false);
                              }}
                           >
                              <option value="">--</option>
                              {accommodationTypesArray.map((element) => (
                                 <option key={element.idtipsmjestaja} value={element.idtipsmjestaja}>
                                    {element.naztipasmjestaja}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="nazivSmjestaja">Accommodation name</label>
                           <input
                              type="text"
                              className="form-control"
                              id="nazivSmjestaja"
                              value={accommodationName}
                              onChange={(e) => {
                                 setAccommodationName(e.target.value);
                                 setErrorMessage(false);
                              }}
                           />
                        </div>
                        <div className='form-group' style={formGroupStyle}>
                           <label htmlFor="drzava">Country</label>
                           <input
                              type="text"
                              className='form-control'
                              id='drzava'
                              value={country}
                              onChange={(e) => {
                                 setCountry(e.target.value);
                                 setErrorMessage(false);
                              }}
                           />
                        </div>

                        <div className='form-group' style={formGroupStyle}>
                           <label htmlFor="grad">City</label>
                           <input
                              type="text"
                              className='form-control'
                              id='grad'
                              value={city}
                              onChange={(e) => {
                                 setCity(e.target.value);
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
                              value={address}
                              onChange={(e) => {
                                 setAddress(e.target.value);
                                 setErrorMessage(false);
                              }}
                           />
                        </div>
                        <div className='form-group' style={formGroupStyle}>
                           <label htmlFor="postanskiBroj">Postal number</label>
                           <input
                              type="text"
                              className='form-control'
                              id='postanskiBroj'
                              value={postalNumber}
                              onChange={(e) => {
                                 setPostalNumber(e.target.value);
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
                              value={price}
                              onChange={(e) => {
                                 setPrice(e.target.value);
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
                              value={capacity}
                              onChange={(e) => {
                                 setCapacity(e.target.value);
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
                              value={numberOfParkingSpots}
                              onChange={(e) => {
                                 setNumberOfParkingSpots(e.target.value);
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
                           <input type="submit" className="btn btn-primary" value="Send" />
                        </div>
                     </form>
                  </div>
               </div>
            </div>
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
   );
};

export default AddAccommodation;