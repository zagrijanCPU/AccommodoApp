import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";
import { baseUrl } from "../../App";
import Accommodations from "./Accommodations";

const RecommendedAccommodations = () => {
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);

   const [loading, setLoading] = useState(true);
   const [recommendedAccommodations, setRecommendedAccommodations] = useState([]);
   var dict = {};


   const setDict = () => {
      for (const [key, value] of queryParams.entries()) {
         // console.log(key + ' - ' + value)
         dict[key] = value;
      }
      // console.log(dict);
   }


   const getRecommendedAccommodations = async (dict) => {
      // console.log(dict);
      try {
         const response = await fetch(`${baseUrl}/api/data/recommendedAccommodations`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({dict})
         });

         if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setRecommendedAccommodations(data);
         }
         else {
            alert("Try again later.");
         }
      } catch (error) {
         console.log("Error", error);
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      setDict();
      getRecommendedAccommodations(dict);
   }, []);


   return (
      <>
         {loading ?
            <Loading />
            :
            <div className="container">
               <Accommodations accommodations={ recommendedAccommodations } />
            </div>
         }
      </>
   );
}

export default RecommendedAccommodations;