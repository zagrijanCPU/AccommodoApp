import React from "react";
import ReactPaginate from "react-paginate";
import { role } from "../../App";
import { deleteAccommodation } from "../Functions";

const AccommodationsTableView = (props) => {
   const items = props.items;
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
                  <th>Accommodation Id</th>
                  <th>Owner Name</th>
                  <th>Accommodation Name</th>
                  <th>Accommodation Type</th>
                  <th>Location</th>
                  <th></th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {items.map(item => (
                  <tr key={item.idsmjestaj} className='claim-row'>
                     <td>{item.idsmjestaj}</td>
                     <td>{item.nazkorisnik}</td>
                     <td>{item.nazivsmjestaja}</td>
                     <td>{item.naztipasmjestaja}</td>
                     <td>{item.lokacija}</td>
                     <td>
                        <a href={`/accommodation/${item.idsmjestaj}`} className="btn btn-secondary">Details</a>
                     </td>
                     {
                        role === "admin" &&
                        <td>
                              <a className="btn btn-danger" onClick={() => {
                                 deleteAccommodation(item.idsmjestaj)
                           }}>Delete</a>
                        </td>
                     }
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default AccommodationsTableView;