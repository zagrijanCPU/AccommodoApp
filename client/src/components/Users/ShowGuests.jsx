import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import TableView from "../TableView/TableView";
import { baseUrl, itemsType, storedToken } from "../../App";

const ShowGuests = () => {
   const [allGuests, setAllGuests] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [currentPage, setCurrentPage] = useState(0);
   const [pageSize, setPageSize] = useState(5);
   const [loading, setLoading] = useState(true);

   const getAllGuests = async () => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/getAllGuests?page=${currentPage + 1}&pageSize=${pageSize}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               },
            })

            if (response.ok) {
               const data = await response.json();
               console.log(data);
               setAllGuests(data);
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
      getAllGuests();
   }, [currentPage]);

   return (
      <>
         {
            loading ?
               <Loading />
               :
               <TableView items={allGuests} itemsType={itemsType[3]} pageCount={pageCount} setCurrentPage={setCurrentPage} />
         }
      </>
   );
}

export default ShowGuests;