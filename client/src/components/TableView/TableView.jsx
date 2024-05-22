import React from "react";
import '../../styles/ReactPaginate.css';
import { itemsType } from "../../App";
import RequestsTableView from "./RequestsTableView";
import AccommodationsTableView from "./AccommodationsTableView";
import ReservationsTableView from "./ReservationsTableView";
import UsersTableView from "./UsersTableView";

const TableView = (props) => {

   const items = props.items;
   const type = props.itemsType;
   const pageCount = props.pageCount;
   const setCurrentPage = props.setCurrentPage;

   return (
      <>
         {type === itemsType[0] && <RequestsTableView items={items} pageCount={pageCount} setCurrentPage={setCurrentPage} />}
         {type === itemsType[1] && <AccommodationsTableView items={items} pageCount={pageCount} setCurrentPage={setCurrentPage} />}
         {type === itemsType[2] && <ReservationsTableView items={items} pageCount={pageCount} setCurrentPage={setCurrentPage} />}
         {type === itemsType[3] && <UsersTableView items={items} pageCount={pageCount} setCurrentPage={setCurrentPage} />}
      </>
   );
}

export default TableView;