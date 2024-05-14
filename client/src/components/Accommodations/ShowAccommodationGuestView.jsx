import React, { useState } from "react";
import { baseUrl, getImageSource, role, storedToken } from "../../App";
import { Modal } from "react-bootstrap";
import { setErrorMessage } from "../Functions";
import { useLocation, useNavigate } from "react-router-dom";

const ShowAccommodationGuestView = (props) => {
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const accommodation = props.accommodation;
   const userId = props.userId;
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [creditCardNumber, setCreditCardNumber] = useState("");
   const [creditCardName, setCreditCardName] = useState("");
   const [creditCardExpirationDate, setCreditCardExpirationDate] = useState("");
   const [creditCardCVC, setCreditCardCVC] = useState("");
   const navigate = useNavigate();

   const handleCardCVCInput = (event) => {
      let inputValue = event.target.value;

      inputValue = inputValue.replace(/\D/g, '');
      setCreditCardCVC(inputValue);
   }

   const handleCardNameInput = (event) => {
      let inputValue = event.target.value;
      inputValue = inputValue.replace(/[^a-zA-ZšđžčćŠĐŽČĆ ]/g, '');

      setCreditCardName(inputValue);
   }

   const handleExpirationDateInput = (event) => {
      let inputValue = event.target.value;

      inputValue = inputValue.replace(/\D/g, '');

      if (inputValue.length <= 4) {
         let formattedValue = '';
         for (let i = 0; i < inputValue.length; i++) {
            if (i === 2 && inputValue.length > 2) {
               formattedValue += '/';
            }
            formattedValue += inputValue[i];
         }

         setCreditCardExpirationDate(formattedValue);
      }
   };

   const handleCardNumberInput = (event) => {
      let inputValue = event.target.value;

      inputValue = inputValue.replace(/\D/g, '');

      let formattedValue = '';
      for (let i = 0; i < inputValue.length; i++) {
         if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
         }
         formattedValue += inputValue[i];
      }

      setCreditCardNumber(formattedValue);
   };

   const validation = () => {
      if (creditCardNumber == "" ||
         creditCardName == "" ||
         creditCardExpirationDate == "" ||
         creditCardCVC == ""
      ) {
         return false;
      }
      return true;
   }

   const handlePayment = async () => {
      if (!validation()) {
         setErrorMessage(true, "All fields are required");
         return;
      }

      
      const data = {
         idGost: userId,
         idSmjestaj: accommodation.idsmjestaj,
         datDolaska: queryParams.get("commingDate"),
         datOdlaska: queryParams.get("leavingDate"),
         brojGostiju: queryParams.get("numberOfGuests"),
         placeno: true,
         otkazano: false
      }

      try {
         const response = await fetch(`${baseUrl}/api/data/makeReservation`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            },
            body: JSON.stringify(data)
         })

         if (response.ok) {
            alert("Reservation payed");
            navigate("/");
            window.location.reload();
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   return (
      <div className="container mt-5">
         <div className="card">
            <img className="card-img-top" src={getImageSource(accommodation.profilnaslika)} alt="Card image" style={{ width: "300px" }} />
            <div className="card-body">
               <h4 className="card-title">{accommodation.nazivsmjestaja}</h4>
               <p className="card-text">Accommodation Type: {accommodation.naztipasmjestaja}</p>
               <p className="card-text">Location: {`${accommodation.grad}, ${accommodation.drzava} (${accommodation.adresa}, ${accommodation.postanskibroj})`}</p>
               <p className="card-text">Price: {`${accommodation.cijena}€`}</p>
               <p className="card-text">Capacity: {`${accommodation.kapacitet}`}</p>
               <p className="card-text">Number of parking spots: {`${accommodation.brojparkirnihmjesta}`}</p>
               {role != "admin" &&
                  <a className="btn btn-primary" onClick={() => {
                     setShowSuccessModal(true);
                  }}>Make reservation</a>}
            </div>
         </div>

         <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>{storedToken ? "Enter your card info" : "Login to make reservation" }</Modal.Title>
            </Modal.Header>
            {storedToken &&
               <Modal.Body>
                  <div className='error-message'></div>
                  <div className='form-group'>
                     <label htmlFor='cardNumber'>Credit card number:</label>
                     <input
                        type='text'
                        className='form-control'
                        id='cardNumber'
                        value={creditCardNumber}
                        onChange={(e) => {
                           handleCardNumberInput(e);
                           setErrorMessage(false, "");
                        }
                        }
                        placeholder='0000 0000 0000 0000'
                        maxLength={19}
                     />
                  </div>
                  <div className='form-group'>
                     <label htmlFor='cardName'>Name and surname:</label>
                     <input type='text'
                        className='form-control'
                        id='cardName'
                        value={creditCardName}
                        placeholder='Pero Perić'
                        onChange={(e) => {
                           handleCardNameInput(e);
                           setErrorMessage(false, "");
                        }} />
                  </div>
                  <div className='form-group'>
                     <label htmlFor='cardExpirationDate'>Expiration date:</label>
                     <input
                        type="text"
                        className='form-control'
                        id='cardExpirationDate'
                        value={creditCardExpirationDate}
                        onChange={(e) => {
                           handleExpirationDateInput(e);
                           setErrorMessage(false, "");
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                     />
                  </div>
                  <div className='form-group'>
                     <label htmlFor='cardCVC'>CVC:</label>
                     <input type='text'
                        className='form-control'
                        id='cardCVC'
                        value={creditCardCVC}
                        placeholder='000'
                        onChange={(e) => {
                           handleCardCVCInput(e);
                           setErrorMessage(false, "");
                        }}
                        maxLength={3}
                     />
                  </div>
               </Modal.Body>
            }
            <Modal.Footer>
               {storedToken ? <a className="btn btn-primary" onClick={handlePayment}>Pay</a> : <a className="btn btn-primary" href="/login">Login</a>}
            </Modal.Footer>
         </Modal>
      </div>
   );
}

export default ShowAccommodationGuestView;