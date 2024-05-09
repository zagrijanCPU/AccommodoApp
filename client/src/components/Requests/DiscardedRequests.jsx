import React, { useEffect, useState } from 'react';
import { baseUrl, itemsType, role, storedToken } from '../../App';
import TableView from './TableView';
import Loading from '../Loading/Loading';

const DiscardedRequests = () => {
   const [currentPage, setCurrentPage] = useState(0);
   const [pageCount, setPageCount] = useState(0);
   const [pageSize, setPageSize] = useState(5);
   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);

   const getRequests = async () => {
      try {
         const response = await fetch(`${baseUrl}/api/data/getDiscardedRequests?page=${currentPage + 1}&pageSize=${pageSize}`, {
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
            setRequests(data.requests);
            setPageCount(Math.ceil(data.totalCount / pageSize));
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getRequests();
   }, [currentPage]);

   return (
      <>
         {
            loading ? 
               <Loading />
               : 
               <TableView items={requests} itemsType={itemsType[0]} pageCount={pageCount} setCurrentPage={setCurrentPage} />
         }
      </>
   );
}

export default DiscardedRequests;