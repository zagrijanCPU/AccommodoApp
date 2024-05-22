import React from "react";
import AllReservations from "./AllReservations";
import CanceledReservations from "./CanceledReservations";
import PreviousReservations from "./PreviousReservations";

const Reservations = () => {
   return (
      <div className="container mt-3">
         <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
               <a className='nav-link active' data-bs-toggle="pill" href="#allReservations">All Reservations</a>
            </li>

            <li className="nav-item">
               <a className='nav-link' data-bs-toggle="pill" href="#previousReservations">Previous Reservations</a>
            </li>
            
            <li className="nav-item">
               <a className='nav-link' data-bs-toggle="pill" href="#canceledReservations">Canceled Reservations</a>
            </li>

         </ul>

         <div className="tab-content">
            <div id='allReservations' className='container tab-pane active'>
               <AllReservations />
            </div>

            <div id='previousReservations' className='container tab-pane fade'>
               <PreviousReservations />
            </div>

            <div id='canceledReservations' className='container tab-pane fade'>
               <CanceledReservations />
            </div>
         </div>
      </div>
   );
}

export default Reservations;