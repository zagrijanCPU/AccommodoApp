import React, { useEffect, useState } from "react";
import { baseUrl } from "../App";
import { useLocation } from "react-router-dom";
import Loading from "./Loading/Loading";
import SearchForm from "./SearchForm";
import Accommodations from "./Accommodations/Accommodations";
import FilteredAccommodations from "./Accommodations/FilteredAccommodations";

const SearchResult = () => {

   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   
   const [loading, setLoading] = useState(true);
   const [accommodations, setAccommodations] = useState([]);

   const city = queryParams.get("city");
   const country = queryParams.get("country");
   const commingDate = queryParams.get("commingDate");
   const leavingDate = queryParams.get("leavingDate");
   const numberOfGuests = queryParams.get("numberOfGuests");
   const data = {
      grad: city,
      drzava: country,
      datDolaska: commingDate,
      datOdlaska: leavingDate,
      brojGostiju: numberOfGuests
   }

   const searchResult = async () => {
      // console.log(data);
      try {
         const response = await fetch(`${baseUrl}/api/data/findAccommodations`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
         })

         if (response.ok) {
            const data = await response.json();
            setAccommodations(data);
            console.log(data);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      searchResult();
   }, []);

   return (
      <>
         {loading ?
            <Loading />
            :
            <div className="container">
               <SearchForm city={city} country={country} commingDate={commingDate} leavingDate={leavingDate} numberOfGuests={numberOfGuests} />
               <FilteredAccommodations accommodations={accommodations} city={city} country={country} commingDate={commingDate} leavingDate={leavingDate} numberOfGuests={numberOfGuests} />
            </div>
         }
      </>
   );
}

export default SearchResult;