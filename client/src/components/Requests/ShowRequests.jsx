import React, { useEffect, useState } from 'react';
import ShowPendingRequests from './ShowPendingRequests';
import ShowApprovedRequests from './ShowApprovedRequests';
import ShowDiscardedRequests from './ShowDiscardedRequests';

const ShowRequests = () => {
   return (
      <div className="container mt-3">
         <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
               <a className='nav-link active' data-bs-toggle="pill" href="#pending">Pending</a>
            </li>

            <li className="nav-item">
               <a className='nav-link' data-bs-toggle="pill" href="#approved">Approved</a>
            </li>

            <li className="nav-item">
               <a className='nav-link' data-bs-toggle="pill" href="#discarded">Discarded</a>
            </li>
         </ul>

         <div className="tab-content">
            <div id='pending' className='container tab-pane active'>
               <ShowPendingRequests />
            </div>

            <div id='approved' className='container tab-pane fade'>
               <ShowApprovedRequests />
            </div>

            <div id='discarded' className='container tab-pane fade'>
               <ShowDiscardedRequests />
            </div>
         </div>
      </div>
   );

}

export default ShowRequests;