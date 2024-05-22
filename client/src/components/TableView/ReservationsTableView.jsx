import React, { useEffect, useState } from "react";
import { checkIfUserAddedRating, handleCancelReservation } from "../Functions";
import ReactPaginate from "react-paginate";

const ReservationsTableView = (props) => {
   const items = props.items;
   const pageCount = props.pageCount;
   const setCurrentPage = props.setCurrentPage;
   const [addedRatings, setAddedRatings] = useState({});

   const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
   };

   const check = async () => {
      console.log(items);
      const newRatings = {};
      for (var item of items) {
         if (new Date(item.datodlaska) <= new Date() && !item.otkazano) {
            newRatings[item.idsmjestaj] = await checkIfUserAddedRating(item.idsmjestaj);
         }
      }

      setAddedRatings(newRatings);
   }

   useEffect(() => {
      check();
   }, []);

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
                  <th>Reservation Id</th>
                  <th>Time of Stay</th>
                  <th>Accommodation Name</th>
                  <th>Accommodation Type</th>
                  <th>Location</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {items.map(item => (
                  <tr key={item.idrezervacija} className='claim-row'>
                     <td>{item.idrezervacija}</td>
                     <td>{`${item.datdolaska.split("T")[0].split("-").reverse().join("-")} - ${item.datodlaska.split("T")[0].split("-").reverse().join("-")}`}</td>
                     <td>{item.nazivsmjestaja}</td>
                     <td>{item.naztipasmjestaja}</td>
                     <td>{item.lokacija}</td>
                     {
                        item.otkazano ?
                           <td>
                              <a href={`/accommodation/${item.idsmjestaj}`} className="btn btn-success" style={{ fontSize: "11px" }}>Make reservation</a>
                           </td>
                           :
                           <>
                              {new Date(item.datodlaska) <= new Date() && !addedRatings[item.idsmjestaj] &&
                                 <td>
                                    <a href={`/accommodation/${item.idsmjestaj}`} className="btn btn-warning">Add Rating</a>
                                 </td>
                              }
                              {new Date(item.datodlaska) > new Date() &&
                                 <td>
                                    <a className="btn btn-danger" onClick={() => {
                                       handleCancelReservation(item.idrezervacija);
                                    }}>Cancel</a>
                                 </td>
                              }
                           </>
                     }
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ReservationsTableView;