import React, { useEffect, useState } from "react";
import { baseUrl, role, storedToken } from "../../App";

const ViewRatings = (props) => {

   const idsmjestaj = props.idsmjestaj;
   const [ratings, setRatings] = useState([]);
   const [avgRating, setAvgRating] = useState();

   const getVisibleRatings = async () => {
      try {
         const response = await fetch(`${baseUrl}/api/data/getVisibleRatings?id=${idsmjestaj}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json"
            }
         })

         if (response.ok) {
            const data = await response.json();
            console.log(data);
            setRatings(data);
            var sum = 0;
            var count = 0;
            data.forEach(element => {
               if (element.vidljiv) {
                  sum += element.ocjena;
                  count++;
               }
            })

            let result = sum / count;
            setAvgRating(parseFloat(result.toFixed(2)));
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   const getAllRatings = async () => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/getAllRatings?id=${idsmjestaj}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               }
            })

            if (response.ok) {
               const data = await response.json();
               console.log(data);
               setRatings(data);
               var sum = 0;
               var count = 0;
               data.forEach(element => {
                  if (element.vidljiv) {
                     sum += element.ocjena;
                     count++;
                  }
               })

               let result = sum / count;
               setAvgRating(parseFloat(result.toFixed(2)));
            }
         } catch (error) {
            console.log("Error: ", error);
         }
      }
   }

   useEffect(() => {
      if (role === "admin") {
         getAllRatings();
      }
      else {
         getVisibleRatings();
      }
   }, []);


   const removeRating = async (id) => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/removeRating?id=${id}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               }
            })

            if (response.ok) {
               alert('Rating removed!');
               window.location.reload();
            }
         } catch (error) {
            console.log("Error: ", error);
         }
      }
   }

   const returnRating = async (id) => {
      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/returnRating?id=${id}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               }
            })

            if (response.ok) {
               alert('Rating returned!');
               window.location.reload();
            }
         } catch (error) {
            console.log("Error: ", error);
         }
      }
   }

   return (
      <div className="mt-3">
         <h1 className='text-center h3'>Ratings</h1>
         {
            ratings.length > 0 && <div>avg: {avgRating.toFixed(2)}</div>
         }
         <div style={{ minHeight: "30vh" }}>
            {
               ratings.length > 0 ?
               ratings.map(item => (
                  <div key={item.idrecenzija} className="card" style={{ marginTop: "10px" }}>
                     <div className="card-body">
                        <p className="card-text"><b>{item.korisnickoime}</b> ({item.ocjena} out of 5)</p>
                        <p className="card-text">{item.tekst}</p>
                     </div>
                     {
                        role === "admin" &&
                        <>
                           {
                              item.vidljiv &&
                              <div className="card-footer">
                                 <a className="btn btn-danger" onClick={() => {
                                    removeRating(item.idrecenzija)
                                 }}>Remove</a>
                              </div>
                           }
                           {
                              !item.vidljiv &&
                              <div className="card-footer">
                                 <a className="btn btn-success" onClick={() => {
                                    returnRating(item.idrecenzija)
                                 }}>Set visible</a>
                              </div>
                           }
                        </>
                     }
                  </div>
               ))
                  :
                  <p className="p-4">No ratings</p>
            }

         </div>
      </div>
   );
}

export default ViewRatings;