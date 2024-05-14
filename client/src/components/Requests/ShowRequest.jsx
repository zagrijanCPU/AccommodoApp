import React, { useEffect, useState } from "react";
import { baseUrl, getImageSource, getPdfSource, role, storedToken } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Loading from "../Loading/Loading";

const ShowRequest = () => {

   var { id } = useParams();
   id = parseInt(id);

   const navigate = useNavigate();
   const [showApproveModal, setShowApproveModal] = useState(false);
   const [showDiscardModal, setShowDiscardModal] = useState(false);
   const [loading, setLoading] = useState(true);
   const [request, setRequest] = useState({
      idzahtjev: 0,
      datumslanjazahtjeva: "",
      nazvrstezahtjeva: "",
      naztipasmjestaja: "",
      nazivsmjestaja: "",
      drzava: "",
      grad: "",
      adresa: "",
      postanskibroj: "",
      cijena: "",
      kapacitet: "",
      brojparkirnihmjesta: "",
      kategorizacija: "",
      vlasnickilist: "",
      profilnaslika: "",
      nacekanju: "",
      odobreno: "",
      odgovor: ""
   });

   const getRequest = async () => {
      console.log(id)
      try {
         const response = await fetch(`${baseUrl}/api/data/getRequest?id=${id}`, {
            method: "POST",
            headers: {
               "Content-type": "application/json",
               "Authorization": storedToken
            },
            body: JSON.stringify({ role })
         })

         if (response.ok) {
            const data = await response.json();
            console.log(data);
            setRequest(data);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getRequest();
   }, []);

   const formatDate = (date) => {
      const d = date.split("T")[0];
      const t = date.split("T")[1];
      return d.split("-").reverse().join(".") + "." + " " + t.split(".")[0];
   }

   const writeResponse = (decision) => {
      if (decision === "approve") {
         setShowApproveModal(true);
      }
      else if (decision === "discard") {
         setShowDiscardModal(true);
      }
   };

   const approveRequest = async () => {
      const odgovor = request.odgovor;
      const nazivVrsteZahtjeva = request.nazvrstezahtjeva;
      try {
         const response = await fetch(`${baseUrl}/api/data/approveRequest?id=${request.idzahtjev}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            },
            body: JSON.stringify({ odgovor, nazivVrsteZahtjeva })
         })

         if (response.ok) {
            alert('Request approved');
            navigate('/allRequests');
         }
      } catch (error) {
         console.log("Error: ", error)
      }
   }

   const discardRequest = async () => {
      const odgovor = request.odgovor;
      try {
         const response = await fetch(`${baseUrl}/api/data/discardRequest?id=${request.idzahtjev}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            },
            body: JSON.stringify({ odgovor })
         })

         if (response.ok) {
            alert('Request discarded');
            navigate('/allRequests');
         }
      } catch (error) {
         console.log("Error: ", error)
      }
   }

   return (
      <>
         {loading ?
            <Loading />
            :
            <div className="container">
               {role === "admin" && <a href="/allRequests" className="btn btn-primary" style={{marginTop: "30px", marginBottom: "30px"}}>Back</a>}
               {role === "vlasnik" && <a href="/myRequests" className="btn btn-primary">Back</a>}
               <div className="card">
                  <img className="card-img-top" src={getImageSource(request.profilnaslika)} alt="Card image" style={{ width: "300px"}} />
                  <div className="card-body">
                     <h4 className="card-title">{request.nazivsmjestaja}</h4>
                     <p className="card-text">Accommodation Type: {request.naztipasmjestaja}</p>
                     <p className="card-text">Request Type: { request.nazvrstezahtjeva}</p>
                     {request.nacekanju && <p className="card-text" style={{ color: "goldenrod" }}>Pending...</p>}
                     {!request.nacekanju && request.odobreno && <p className="card-text" style={{ color: "green" }}>Approved</p>}
                     {!request.nacekanju && !request.odobreno && <p className="card-text" style={{ color: "red" }}>Discarded</p>}
                     {
                        request.kategorizacija &&
                           <p className="card-text">
                              <embed src={getPdfSource(request.kategorizacija)} type="application/pdf" width="40%" height="600px" />
                           </p>
                     }
                     {
                        request.vlasnickilist &&
                           <p className="card-text">
                              <embed src={getPdfSource(request.vlasnickilist)} type="application/pdf" width="40%" height="600px" />
                           </p>
                     }
                     {request.odgovor && 
                        <textarea
                           name="odgovor"
                           id="odgovor"
                           className="form-control"
                           rows={10}
                           cols={50}
                           disabled
                           value={request.odgovor}
                           style={{ resize: "none" }}
                     />
                     }
                     <p className="card-text">Request sent: {formatDate(request.datumslanjazahtjeva)}</p>
                  </div>
                  {
                     role === "admin" && request.nacekanju ? 
                        <div className="card-footer">
                           <a className="btn btn-success" onClick={() => { writeResponse("approve") }}>Approve</a>
                           <a className="btn btn-danger" onClick={() => { writeResponse("discard") }}>Discard</a>
                        </div>
                        :
                        <></>
                  }  
               </div>

               <Modal show={showApproveModal} onHide={() => {
                  setShowApproveModal(false);
                  setRequest({ ...request, odgovor: "" })
               }}>
                  <Modal.Header closeButton>
                     <Modal.Title>Write message</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                     <div className="container">
                        <textarea
                           name="odgovor"
                           id="odgovor"
                           className="form-control"
                           rows={10}
                           cols={50}
                           style={{ resize: "none" }}
                           onChange={(e) => {
                              setRequest({ ...request, odgovor: e.target.value });
                           }}
                        />
                     </div>
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                     <a className="btn btn-primary" onClick={() => {
                        approveRequest();
                     }}>Send</a>
                  </Modal.Footer>
               </Modal>

               <Modal show={showDiscardModal} onHide={() => {
                  setShowDiscardModal(false);
                  setRequest({ ...request, odgovor: "" })
               }}>
                  <Modal.Header closeButton>
                     <Modal.Title>Write message</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                     <div className="container">
                        <textarea
                           name="odgovor"
                           id="odgovor"
                           className="form-control"
                           rows={10}
                           cols={50}
                           style={{ resize: "none" }}
                           onChange={(e) => {
                              setRequest({ ...request, odgovor: e.target.value });
                           }}
                        />
                     </div>
                  </Modal.Body>
                  <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                     <a className="btn btn-primary" onClick={() => {
                        discardRequest();
                     }}>Send</a>
                  </Modal.Footer>
               </Modal>
            </div>
         }
      </>
   );
}

export default ShowRequest;