import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import AllAccommodations from "./Accommodations/AllAccommodations";
import { role, storedToken } from "../App";
import AllRecommendations from "./Recommendations/AllRecommentadions";
import { getUsername } from "./Functions";
import Loading from "./Loading/Loading";

function Home() {

   const [username, setUsername] = useState();
   const [loading, setLoading] = useState(true);

   const setters = async () => {
      setUsername(await getUsername());
      setLoading(false);
   }

   useEffect(() => {
      setters();
   }, []);

   return (
      <>
         {(role === "guest" || !storedToken) &&
            <>
               <SearchForm />
               <div className="container mt-5">
                  <h1 className="text-center">
                     We recommend
                  </h1>
               </div>
               <AllRecommendations />
            </>
         }
         {loading ?
            <Loading /> :
            (role !== "guest" && storedToken && <h1>Welcome, '{username}'!</h1>)
         }
      </>
   );
}

export default Home;