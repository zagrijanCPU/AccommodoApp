import React from "react";
import ReactPaginate from "react-paginate";

const RequestsTableView = (props) => {
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
                  <th>Claim Id</th>
                  <th>Request Type</th>
                  <th>Owner Name</th>
                  <th>Accommodation Name</th>
                  <th>Accommodation Type</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {items.map(item => (
                  <tr key={item.idzahtjev} className='claim-row'>
                     <td>{item.idzahtjev}</td>
                     <td>{item.nazvrstezahtjeva}</td>
                     <td>{item.nazkorisnik}</td>
                     <td>{item.nazivsmjestaja}</td>
                     <td>{item.naztipasmjestaja}</td>
                     <td>
                        <a href={`/request/${item.idzahtjev}`} className="btn btn-secondary">Details</a>
                     </td>
                     {/* <td>
                        <a className="btn btn-success">Approve</a>
                     </td> */}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default RequestsTableView;