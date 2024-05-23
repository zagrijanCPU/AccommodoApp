import React, { useEffect, useState } from "react";
import { baseUrl, itemsType, role, storedToken } from "../../App";
import '../../styles/ReactPaginate.css';
import TableView from "../TableView/TableView";
import Loading from "../Loading/Loading";

const ShowAccommodations = () => {

   const [currentPage, setCurrentPage] = useState(0);
   const [pageCount, setPageCount] = useState(0);
   const [pageSize, setPageSize] = useState(5);
   const [accommodations, setAccommodations] = useState([]);
   const [loading, setLoading] = useState(true);

   const getAccommodations = async () => {
      try {
         if (storedToken) {
            const response = await fetch(`${baseUrl}/api/data/getAccommodations?page=${currentPage + 1}&pageSize=${pageSize}`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               },
               body: JSON.stringify({role})
            });
   
            if (response.ok) {
               const data = await response.json();
               console.log(data);
               setAccommodations(data.accommodations);
               setPageCount(Math.ceil(data.totalCount / pageSize));
            }
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getAccommodations();
   }, [currentPage]);

   return (
      <>
         {
            loading ? 
               <Loading />
               :
               <TableView items={accommodations} itemsType={itemsType[1]} pageCount={pageCount} setCurrentPage={setCurrentPage} />
         }
      </>
   );
};

export default ShowAccommodations;