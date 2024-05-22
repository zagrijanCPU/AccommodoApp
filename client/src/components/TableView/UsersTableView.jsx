import React from "react";
import ReactPaginate from "react-paginate";
import { deleteUser } from "../Functions";

const UsersTableView = (props) => {

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
                  <th>User Id</th>
                  <th>Role</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {items.map(item => (
                  <tr key={item.idkorisnik} className='claim-row'>
                     <td>{item.idkorisnik}</td>
                     <td>{item.nazuloga}</td>
                     <td>{item.ime}</td>
                     <td>{item.prezime}</td>
                     <td>{item.korisnickoime}</td>
                     <td>{item.email}</td>
                     <td>
                        <a className="btn btn-danger" onClick={() => {
                           deleteUser(item.idkorisnik);
                        }}>Delete</a>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default UsersTableView;