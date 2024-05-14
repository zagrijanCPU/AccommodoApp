import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../App";
import { useNavigate } from "react-router-dom";

function SearchForm(props) {

   const formGroupStyle = {
      margin: '10px'
   }

   const [locations, setLocations] = useState([]);
   const [searchTerm, setSearchTerm] = useState(Object.keys(props).length > 0 ? props.city + ", " + props.country : "");
   const [commingDate, setCommingDate] = useState(Object.keys(props).length > 0 ? props.commingDate : "");
   const [leavingDate, setLeavingDate] = useState(Object.keys(props).length > 0 ? props.leavingDate : "");
   const [numberOfGuests, setNumberOfGuests] = useState(Object.keys(props).length > 0 ? props.numberOfGuests : 1);
   const dateToday = new Date().toISOString().split("T")[0];
   const [nextCorrectDate, setNextCorrectDate] = useState("");
   const navigate = useNavigate();


   const updateNextCorrectDate = (date) => {
      if (date) {
         var updatedDate = new Date(date);
         updatedDate.setDate(updatedDate.getDate() + 1);
         setNextCorrectDate(updatedDate.toISOString().split("T")[0]);
         console.log(updatedDate.toISOString());
      }
   }

   const getAllLocations = async () => {
      try {
         const response = await fetch(`${baseUrl}/api/data/getAllLocations`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json"
            }
         })

         if (response.ok) {
            const data = await response.json();
            setLocations(data);
            console.log(data);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

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
      if (!validation()) {
         return;
      }
      // console.log(searchTerm);
      // console.log(commingDate);
      // console.log(leavingDate);
      // console.log(numberOfGuests);
      // console.log(numberOfParkingSpots);

      const city = searchTerm.split(", ")[0];
      const country = searchTerm.split(", ")[1]

      navigate(`/searchResult?city=${city}&country=${country}&commingDate=${commingDate}&leavingDate=${leavingDate}&numberOfGuests=${numberOfGuests}`);
      window.location.reload();
   }

   useEffect(() => {
      getAllLocations();
      updateNextCorrectDate(dateToday);
   }, []);


   return (

      <div className="container mt-5">
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card">
                  <div className="card-body">
                     <div className="error-message"></div>
                     <form onSubmit={handleSubmit} method="post">
                        <div className="form-group" style={formGroupStyle}>
                           <label htmlFor="country">Location</label>
                           <input
                              type="text"
                              list="options"
                              className="form-control"
                              value={searchTerm}
                              onChange={(e) => {
                                 setSearchTerm(e.target.value);
                                 setErrorMessage(false, "");
                              }}
                           />
                           <datalist id="options">
                              {locations.map((location, index) => (
                                 <option key={index} value={`${location.grad}, ${location.drzava}`} />
                              ))}
                           </datalist>
                        </div>
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
                              Number of guests
                           </label>
                           <input
                              type="number"
                              min={1}
                              className="form-control"
                              value={numberOfGuests}
                              onChange={(e) => {
                                 setNumberOfGuests(e.target.value);
                                 setErrorMessage(false, "");
                              }}
                           />
                        </div>
                        <div className="form-group" style={formGroupStyle}>
                           <input type="submit" className="btn btn-primary" value="Search" />
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default SearchForm;