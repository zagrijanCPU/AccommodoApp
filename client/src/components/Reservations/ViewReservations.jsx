import React, { useEffect, useState } from "react";
import { baseUrl, role, storedToken } from "../../App";
import ReactPaginate from "react-paginate";
import { format } from 'date-fns';

const ViewReservations = () => {
   const [reservations, setReservations] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [currentPage, setCurrentPage] = useState(0);
   const [pageSize, setPageSize] = useState(5);

   const getReservations = async () => {
      const response = await fetch(`${baseUrl}/api/data/getReservations?page=${currentPage + 1}&pageSize=${pageSize}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": storedToken
         },
         body: JSON.stringify({ role })
      })

      if (response.ok) {
         const data = await response.json();
         console.log(data);
         setReservations(data.reservations);
         setPageCount(Math.ceil(data.totalCount / pageSize));
      }
   }

   const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
   };

   useEffect(() => {
      getReservations();
   }, [currentPage]);

   return (
      <div className='container mt-5'>
         <div className="d-flex justify-content-end">
            <ReactPaginate
               pageCount={pageCount}
               pageRangeDisplayed={5}
               marginPagesDisplayed={2}
               onPageChange={handlePageClick}
               containerClassName={'pagination'}
               activeClassName={'active'}
            />
         </div>
         <table className="table">
            <thead>
               <tr>
                  <th>Reservation ID</th>
                  <th>Reservation date</th>
                  <th>Accommodation Name</th>
                  <th>Booked dates</th>
                  <th>Guests</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {reservations.map(item => (
                  <tr key={item.idrezervacija} className='claim-row'>
                     <td>{item.idrezervacija}</td>
                     <td>{format(new Date(item.datrezervacije), 'dd.MM.yyyy')}</td>
                     <td>{item.nazivsmjestaja}</td>
                     <td>{format(new Date(item.datdolaska), 'dd.MM.yyyy') + " - " + format(new Date(item.datodlaska), 'dd.MM.yyyy')}</td>
                     <td>{item.brojgostiju}</td>
                     <td>
                        <a href={"/reservation/" + item.idrezervacija} className='btn btn-secondary'>Details</a>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ViewReservations;