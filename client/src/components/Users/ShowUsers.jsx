import React from "react";
import ShowOwners from "./ShowOwners";
import ShowGuests from "./ShowGuests";

const ShowUsers = () => {
   return (
      <div className="container mt-3">
         <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
               <a className='nav-link active' data-bs-toggle="pill" href="#allOwners">All Owners</a>
            </li>

            <li className="nav-item">
               <a className='nav-link' data-bs-toggle="pill" href="#allGuests">All Guests</a>
            </li>
         </ul>

         <div className="tab-content">
            <div id='allOwners' className='container tab-pane active'>
               <ShowOwners />
            </div>

            <div id='allGuests' className='container tab-pane fade'>
               <ShowGuests />
            </div>
         </div>
      </div>
   );
}

export default ShowUsers;