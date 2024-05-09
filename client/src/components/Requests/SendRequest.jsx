import React, { useEffect, useState } from "react";
import { baseUrl, storedToken } from "../../App";
import AddAccommodation from "./AddAccommodation";
import ChangeData from "./ChangeData";

const SendRequest = () => {

   const [requestTypes, setRequestTypes] = useState([]);

   const getRequestTypes = async () => {
      try {
         const response = await fetch(`${baseUrl}/api/data/requestTypes`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         if (response.ok) {
            const data = await response.json();
            setRequestTypes(data);
            // console.log(data);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }

   useEffect(() => {
      getRequestTypes();
   }, []);

   return (
      <div className="container mt-3">
         <h3>Choose Request Type</h3>
         <br />
         <ul className="nav nav-pills" role="tablist">
            {
               requestTypes.map((item, i) => (
                  <li className="nav-item" key={item.idvrstazahtjeva}>
                     <a className={i == 0 ? "nav-link active" : "nav-link"} data-bs-toggle="pill" href={"#" + item.idvrstazahtjeva}>{item.nazvrstezahtjeva}</a>
                  </li>
               ))
            }
         </ul>

         <div className="tab-content">
            {
               requestTypes.map((item, i) => (
                  <div key={item.idvrstazahtjeva} id={item.idvrstazahtjeva} className={i == 0 ? "container tab-pane active" : "container tab-pane fade"}>
                     {item.nazvrstezahtjeva == "Add Accommodation" ?
                        <AddAccommodation requestTypeId={ item.idvrstazahtjeva } />
                        :
                        <></>
                     }
                     {item.nazvrstezahtjeva == "Change data" ?
                        <ChangeData requestTypeId={ item.idvrstazahtjeva } />
                        :
                        <></>
                     }
                  </div>
               ))
            }
         </div>
      </div>
   );
}

export default SendRequest;