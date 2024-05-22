import React from "react";
import SearchForm from "./SearchForm";
import AllAccommodations from "./Accommodations/AllAccommodations";
import { role, storedToken } from "../App";

function Home() {

   return (
      <>
         {(role === "guest" || !storedToken) &&
            <>
               <SearchForm />
               <AllAccommodations />
            </>
         }
      </>
   );
}

export default Home;