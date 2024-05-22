import React, { useEffect, useState } from "react";
import { getAccommodations } from "../Functions";
import Accommodations from "./Accommodations";

const AllAccommodations = () => {
   const [accommodations, setAccommodations] = useState([]);

   const getData = async () => {
      setAccommodations(await getAccommodations());
   }

   useEffect(() => {
      getData();
   }, []);

   return (
      <Accommodations accommodations={ accommodations } />
   );
}

export default AllAccommodations;