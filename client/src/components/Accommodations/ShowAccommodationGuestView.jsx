import React, { useEffect, useState } from "react";
import { baseUrl, getImageSource, role, storedToken } from "../../App";
import { Modal } from "react-bootstrap";
import { checkIfUserAddedRating, setErrorMessage } from "../Functions";
import { useLocation, useNavigate } from "react-router-dom";
import SearchForm from "../SearchForm";
import ViewRatings from "../Ratings/ViewRatings";
import CustomCalendar from "../Calendars/CustomCalendar";
import AddRating from "../Ratings/AddRating";
import Loading from "../Loading/Loading";

const ShowAccommodationGuestView = (props) => {

   const formGroupStyle = {
      margin: '10px'
   }


   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const accommodation = props.accommodation;
   const userId = props.userId;
   const intervals = props.intervals;
   const [didMakeReservation, setDidMakeReservation] = useState(false);
   const [addedRating, setAddedRating] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [creditCardNumber, setCreditCardNumber] = useState("");
   const [creditCardName, setCreditCardName] = useState("");
   const [creditCardExpirationDate, setCreditCardExpirationDate] = useState("");
   const [loading, setLoading] = useState(true);
   const [creditCardCVC, setCreditCardCVC] = useState("");
   const navigate = useNavigate();


   const [searchTerm, setSearchTerm] = useState((queryParams.get("city") ? queryParams.get("city") : accommodation.grad) + ", " + (queryParams.get("country") ? queryParams.get("country") : accommodation.drzava));
   const [commingDate, setCommingDate] = useState(queryParams.get("commingDate") ? queryParams.get("commingDate") : "");
   const [leavingDate, setLeavingDate] = useState(queryParams.get("leavingDate") ? queryParams.get("leavingDate") : "");
   const [numberOfGuests, setNumberOfGuests] = useState(queryParams.get("numberOfGuests") ? queryParams.get("numberOfGuests") : "");
   const dateToday = new Date().toISOString().split("T")[0];
   const [nextCorrectDate, setNextCorrectDate] = useState("");


   const updateNextCorrectDate = (date) => {
      if (date) {
         var updatedDate = new Date(date);
         updatedDate.setDate(updatedDate.getDate() + 1);
         setNextCorrectDate(updatedDate.toISOString().split("T")[0]);
         console.log(updatedDate.toISOString());
      }
   }


   const validationDates = () => {
      if (searchTerm == "" ||
         commingDate == "" ||
         leavingDate == "" ||
         numberOfGuests == ""
      ) {
         setErrorMessage(true, "All fields are required!");
         return false;
      }

      return true;
   }

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validationDates()) {
         return;
      }
      try {
         const dates = {
            datDolaska: commingDate,
            datOdlaska: leavingDate
         }
         const response = await fetch(`${baseUrl}/api/data/checkAvailability?id=${accommodation.idsmjestaj}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(dates)
         });
         const data = await response.json();
         // console.log(data);
         if (data == 0) {
            const city = searchTerm.split(", ")[0];
            const country = searchTerm.split(", ")[1]

            navigate(`/accommodation/${accommodation.idsmjestaj}?city=${city}&country=${country}&commingDate=${commingDate}&leavingDate=${leavingDate}&numberOfGuests=${numberOfGuests}`);
            window.location.reload();
         }
         else {
            alert("These dates are not available.");
         }
      } catch (error) {
         console.log("Error: ", error);
      }

   }


   const checkIfUserMadeReservation = async (id) => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/madeReservation?id=${id}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               }
            });

            const data = await response.json();
            setDidMakeReservation(data.madeReservation);
         } catch (error) {
            console.log("Error: ", error);
         }
      }
   }

   const checks = async () => {
      await checkIfUserMadeReservation(accommodation.idsmjestaj);
      setAddedRating(await checkIfUserAddedRating(accommodation.idsmjestaj));
      setLoading(false);
   }

   useEffect(() => {
      checks();
   }, [])

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
         <br />
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card">
                  <div className="card-body">
                     <div className="error-message"></div>
                     <form onSubmit={handleSubmit} method="post">
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="date">Comming date</label>
                           <input
                              type="date"
                              className="form-control"
                              min={dateToday}
                              value={commingDate}
                              onChange={(e) => {
                                 setCommingDate(e.target.value);
                                 updateNextCorrectDate(e.target.value);
                                 setErrorMessage(false, "");
                              }}
                           />
                        </div>

                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="date">Leaving date</label>
                           <input
                              type="date"
                              className="form-control"
                              min={nextCorrectDate}
                              disabled={commingDate == "" ? true : false}
                              value={leavingDate}
                              onChange={(e) => {
                                 setLeavingDate(e.target.value);
                                 setErrorMessage(false, "");
                              }}
                           />
                        </div>

                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="brojGostiju">
                              Number of guests (max: {accommodation.kapacitet})
                           </label>
                           <input
                              type="number"
                              min={1}
                              max={accommodation.kapacitet}
                              className="form-control"
                              value={numberOfGuests}
                              onChange={(e) => {
                                 setNumberOfGuests(e.target.value);
                                 setErrorMessage(false, "");
                              }}
                           />
                        </div>

                        <div className="form-group" style={formGroupStyle}>
                           <input type="submit" className="btn btn-primary" value="Change options" />
                        </div>
                     </form>
                  </div>
               </div>
               <div className="card">
                  <img className="card-img-top" src={getImageSource(accommodation.profilnaslika)} alt="Card image" style={{ width: "100%" }} />
                  <div className="card-body">
                     <h4 className="card-title">{accommodation.nazivsmjestaja}</h4>
                     <p className="card-text">Accommodation Type: {accommodation.naztipasmjestaja}</p>
                     <p className="card-text">Location: {`${accommodation.grad}, ${accommodation.drzava} (${accommodation.adresa}, ${accommodation.postanskibroj})`}</p>
                     <p className="card-text">Price: {`${accommodation.cijena}€`}</p>
                     <p className="card-text">Capacity: {`${accommodation.kapacitet}`}</p>
                     <p className="card-text">Number of parking spots: {`${accommodation.brojparkirnihmjesta}`}</p>
                     {(role == "guest" || !storedToken) &&
                        <a className="btn btn-primary" onClick={() => {
                           if (queryParams.size == 0) {
                              if (storedToken) {
                                 alert('You must pick the dates first!');
                                 return;
                              }
                              else {
                                 alert('You must login first!');
                                 navigate('/login');
                                 window.location.reload();
                                 return;
                              }
                           }
                           else {
                              if (storedToken) {
                                 setShowSuccessModal(true);
                              }
                              else {
                                 alert('You must login first!');
                                 navigate('/login');
                                 window.location.reload();
                                 return;
                              }
                           }
                        }}>Make reservation</a>
                     }
                  </div>
               </div>
            </div>
            <div className="col-md-6">
               <CustomCalendar intervals={intervals} />
               {loading ?
                  <Loading />
                  :
                  <>
                     {didMakeReservation && !addedRating && <AddRating idsmjestaj={accommodation.idsmjestaj} />}
                  </>
               }
               <ViewRatings idsmjestaj={accommodation.idsmjestaj} />
            </div>
         </div>

         <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>"Enter your card info"</Modal.Title>
            </Modal.Header>
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
                     placeholder='John Doe'
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
            <Modal.Footer>
               <a className="btn btn-primary" onClick={handlePayment}>Pay</a>
            </Modal.Footer>
         </Modal>
      </div>
   );
}

export default ShowAccommodationGuestView;