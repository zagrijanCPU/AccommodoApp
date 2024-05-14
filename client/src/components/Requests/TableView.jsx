import React, { useState } from "react";
import ReactPaginate from 'react-paginate';
import '../../styles/ReactPaginate.css';
import { itemsType } from "../../App";

const TableView = (props) => {

   const items = props.items;
   const type = props.itemsType;
   const pageCount = props.pageCount;
   const setCurrentPage = props.setCurrentPage;

   const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
   };

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
                  {type === itemsType[0] && <th>Claim ID</th>}
                  {type === itemsType[1] && <th>Accommodation ID</th>}
                  {type === itemsType[2] && <th>Reservation ID</th>}
                  {type === itemsType[0] && <th>Request Type</th>}
                  {type !== itemsType[2] && <th>Owner name</th>}
                  {type === itemsType[2] && <th>Time of stay</th>}
                  <th>Accommodation Name</th>
                  <th>Accommodation Type</th>
                  {(type === itemsType[1] || type === itemsType[2]) && <th>Location</th>}
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {items.map(item => (
                  <tr key={type === itemsType[0] ? item.idzahtjev : type === itemsType[1] ? item.idsmjestaj : item.idrezervacija} className='claim-row'>
                     {type === itemsType[0] && <td>{item.idzahtjev}</td>}
                     {type === itemsType[1] && <td>{item.idsmjestaj}</td>}
                     {type === itemsType[2] && <td>{ item.idrezervacija}</td>}
                     {type === itemsType[0] && <td>{item.nazvrstezahtjeva}</td>}
                     {type !== itemsType[2] && <td>{item.nazkorisnik}</td>}
                     {type === itemsType[2] && <td>{ `${item.datdolaska.split("T")[0].split("-").reverse().join("-")} - ${item.datodlaska.split("T")[0].split("-").reverse().join("-")}` }</td>}
                     <td>{item.nazivsmjestaja}</td>
                     <td>{item.naztipasmjestaja}</td>
                     {(type === itemsType[1] || type === itemsType[2]) && <td>{item.lokacija}</td>}
                     {
                        type === itemsType[0] && 
                        <td>
                           <a href={`/request/${item.idzahtjev}`} className="btn btn-secondary">Details</a>
                        </td>
                     }
                     {
                        type === itemsType[1] &&
                        <td>
                           <a href={`/accommodation/${item.idsmjestaj}`} className="btn btn-secondary">Details</a>
                        </td>
                     }
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default TableView;