import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, role, storedToken } from "../../App";
import Loading from "../Loading/Loading";
import { getAccommodation, getRequestTypes, getUserId } from "../Functions";
import ShowAccommodationOwnerView from "./ShowAccommodationOwnerView";
import ShowAccommodationGuestView from "./ShowAccommodationGuestView";
import ShowAccommodationAdminView from "./ShowAccommodationAdminView";

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
   const [intervals, setIntervals] = useState([]);

   const getData = async () => {
      var data = await getAccommodation(id);
      if (data) {
         setAccommodation(data);
      }

      data = await getUserId();
      if (data) {
         setUserId(data.toString());
      }

      if (role == "owner") {
         data = await getRequestTypes();
         if (data) {
            for (var i = 0; i < data.length; i++) {
               if (data[i].nazvrstezahtjeva === "Change data") {
                  setRequestTypeId(data[i].idvrstazahtjeva);
               }
            }
         }
      }
      await getIntervals();
      setLoading(false);
   }

   const getIntervals = async () => {
      try {
         const response = await fetch(`${baseUrl}/api/data/occupiedDates?id=${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json"
            }
         })

         if (response.ok) {
            const data = await response.json();
            // console.log(data);
            var temp = []
            data.forEach(element => {
               temp.push({start: new Date(element.datdolaska.split("T")[0]), end: new Date(element.datodlaska.split("T")[0])});
            });
            setIntervals(temp);
         }
      } catch (error) {
         console.log("Error: ", error);
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
               <>
                  {role == "owner" && <ShowAccommodationOwnerView accommodation={accommodation} setAccommodation={setAccommodation} userId={userId} requestTypeId={requestTypeId} intervals={intervals} />}
                  {(role == "guest" || !storedToken) && <ShowAccommodationGuestView accommodation={accommodation} userId={userId} intervals={intervals} />}
                  {role == "admin" && <ShowAccommodationAdminView accommodation={accommodation} userId={userId} intervals={intervals} />}
               </>
         }
      </>
   );
}

export default ShowAccommodation;