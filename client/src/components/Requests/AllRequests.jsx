import React, { useEffect, useState } from 'react';
import PendingRequests from './PendingRequests';
import ApprovedRequests from './ApprovedRequests';
import DiscardedRequests from './DiscardedRequests';

const AllRequests = () => {
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
               <PendingRequests />
            </div>

            <div id='approved' className='container tab-pane fade'>
               <ApprovedRequests />
            </div>

            <div id='discarded' className='container tab-pane fade'>
               <DiscardedRequests />
            </div>
         </div>
      </div>
   );

}

export default AllRequests;