import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShowAccommodation = () => {
   var { id } = useParams();
   id = parseInt(id);

   const navigate = useNavigate();
   const [accommodation, setAccommodation] = useState({
      idsmjestaj: 0,

   });
}

export default ShowAccommodation;