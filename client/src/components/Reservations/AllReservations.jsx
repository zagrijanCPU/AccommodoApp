import React, { useEffect, useState } from "react";
import { baseUrl, itemsType, role, storedToken } from "../../App";
import Loading from "../Loading/Loading";
import TableView from "../TableView/TableView";

const AllReservations = () => {
   const [reservations, setReservations] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [currentPage, setCurrentPage] = useState(0);
   const [pageSize, setPageSize] = useState(5);
   const [loading, setLoading] = useState(true);

   const getReservations = async () => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/allReservations?page=${currentPage + 1}&pageSize=${pageSize}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               },
            })

            if (response.ok) {
               const data = await response.json();
               console.log(data);
               setReservations(data.reservations);
               setPageCount(Math.ceil(data.totalCount / pageSize));
            }
         } catch (error) {
            console.log("Error: ", error);
         }
         finally {
            setLoading(false);
         }
      }
   }


   useEffect(() => {
      getReservations();
   }, [currentPage]);

   return (
      <>
         {
            loading ?
               <Loading />
               :
               <TableView items={reservations} itemsType={itemsType[2]} pageCount={pageCount} setCurrentPage={setCurrentPage} />
         }
      </>
   );
}

export default AllReservations;