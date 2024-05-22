import React from "react";
import Accommodations from "./Accommodations";

const FilteredAccommodations = (props) => {
   const accommodations = props.accommodations;
   const city = props.city;
   const country = props.country;
   const commingDate = props.commingDate;
   const leavingDate = props.leavingDate;
   const numberOfGuests = props.numberOfGuests;

   return (
      <Accommodations accommodations={accommodations} city={city} country={country} commingDate={commingDate} leavingDate={leavingDate} numberOfGuests={numberOfGuests}/>
   );
}

export default FilteredAccommodations;