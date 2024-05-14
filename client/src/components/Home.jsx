import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import AllAccommodations from "./Accommodations/AllAccommodations";
import { getAccommodations } from "./Functions";

function Home() {

   const [accommodations, setAccommodations] = useState([]);

   const getData = async () => {
      setAccommodations(await getAccommodations());
   }

   useEffect(() => {
      getData();
   }, []);

   return (
      <>
         <SearchForm />
         <AllAccommodations accommodations={accommodations} />
      </>
   );
}

export default Home;