import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, getImageSource, role } from "../../App";
import Loading from "../Loading/Loading";
import { Modal } from "react-bootstrap";
import { getAccommodation, getRequestTypes, getUserId, setErrorMessage } from "../Functions";
import ShowAccommodationOwnerView from "./ShowAccommodationOwnerView";
import ShowAccommodationGuestView from "./ShowAccommodationGuestView";

const ShowAccommodation = () => {
   var { id } = useParams();
   id = parseInt(id);

   const [requestTypeId, setRequestTypeId] = useState(0);
   const [loading, setLoading] = useState(true);
   const [userId, setUserId] = useState("");
   const [accommodation, setAccommodation] = useState({
      idsmjestaj: 0,
      idtipsmjestaja: 0,
      naztipasmjestaja: "",
      nazivsmjestaja: "",
      drzava: "",
      grad: "",
      adresa: "",
      postanskibroj: "",
      cijena: "",
      kapacitet: "",
      brojparkirnihmjesta: "",
      profilnaslika: ""
   });

   const getData = async () => {
      var data = await getAccommodation(id);
      if (data) {
         setAccommodation(data);
         setLoading(false);
      }

      data = await getUserId();
      if (data) {
         setUserId(data.toString());
      }

      if (role == "vlasnik") {
         data = await getRequestTypes();
         if (data) {
            for (var i = 0; i < data.length; i++) {
               if (data[i].nazvrstezahtjeva === "Change data") {
                  setRequestTypeId(data[i].idvrstazahtjeva);
               }
            }
         }
      }
   }

   useEffect(() => {
      getData();
   }, []);

   return (
      <>
         {
            loading ?
               <Loading />
               :
               role == "vlasnik" ?
                  <ShowAccommodationOwnerView accommodation={accommodation} setAccommodation={setAccommodation} userId={userId} requestTypeId={requestTypeId} />
                  :
                  <ShowAccommodationGuestView accommodation={accommodation} userId={userId} />
         }
      </>
   );
}

export default ShowAccommodation;