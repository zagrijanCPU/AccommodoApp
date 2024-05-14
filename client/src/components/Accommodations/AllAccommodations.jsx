import React from "react";
import { getImageSource } from "../../App";

const AllAccommodations = (props) => {

   const accommodations = props.accommodations;

   return (
      <div className="d-flex justify-content-center flex-wrap gap-5 mt-5">
         {
            accommodations.map(item => (
               <div key={item.idsmjestaj} className="card" style={{ width: "300px" }}>
                  <img className="card-img-top" src={getImageSource(item.profilnaslika)} alt="Card image" style={{ width: "100%" }} />
                  <div className="card-body">
                     <h4 className="card-title">{item.nazivsmjestaja}</h4>
                     <p className="card-text">Accommodation Type: {item.naztipasmjestaja}</p>
                     <a href={`/accommodation/${item.idsmjestaj}`} className="btn btn-primary">More details</a>
                  </div>
               </div>
            ))
         }
      </div>
   );
}

export default AllAccommodations;