import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { setErrorMessage } from "../Functions";
import { baseUrl, storedToken } from "../../App";

const AddRating = (props) => {

   const idsmjestaj = props.idsmjestaj;
   const formGroupStyle = {
      margin: "10px"
   }
   const [showAddRatingModal, setShowAddRatingModal] = useState(false);
   const [grade, setGrade] = useState("");
   const [text, setText] = useState("");


   const validation = () => {
      if (grade === "" ||
         text === ""
      ) {
         setErrorMessage(true, "All fields are required");
         return false;
      }
      return true;
   }

   const handleAddRating = async () => {
      if (!validation()) {
         return;
      }

      // console.log(grade, text);

      const data = {
         ocjena: grade,
         tekst: text
      }

      if (storedToken) {
         try {
            const response = await fetch(`${baseUrl}/api/data/addRating?id=${idsmjestaj}`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": storedToken
               },
               body: JSON.stringify(data)
            });

            if (response.ok) {
               alert('Your rating is sent');
               window.location.reload();
            }
         } catch (error) {
            console.log("Error: ", error);
         }
      }
   }

   return (
      <div className="row justify-content-center mt-3">
         <a className="btn btn-warning" style={{ width: "30%" }} onClick={() => {
            setShowAddRatingModal(true);
         }}>Add Rating</a>

         <Modal show={showAddRatingModal} onHide={() => setShowAddRatingModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Rate this accommodation!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="error-message"></div>
               <div className="form-group" style={formGroupStyle}>
                  <label htmlFor="grade">Insert grade (1-5)</label>
                  <input
                     type="number"
                     name="grade"
                     className="form-control"
                     id="grade"
                     min={1}
                     max={5}
                     value={grade}
                     onChange={(e) => {
                        setGrade(e.target.value);
                        if (e.target.value < 1 || e.target.value > 5) {
                           setErrorMessage(true, "Grade must be from 1 to 5.");
                        }
                        else {
                           setErrorMessage(false, "");
                        }
                     }}
                  />
               </div>
               <div className="form-group" style={formGroupStyle}>
                  <label htmlFor="text">Write comment</label>
                  <textarea
                     name="text"
                     id="text"
                     className="form-control"
                     style={{ resize: "none" }}
                     rows={10}
                     cols={50}
                     value={text}
                     onChange={(e) => {
                        setText(e.target.value);
                        setErrorMessage(false, "");
                     }}
                  />
               </div>
            </Modal.Body>
            <Modal.Footer>
               <a className="btn btn-primary" onClick={handleAddRating}>
                  Send
               </a>
            </Modal.Footer>
         </Modal>
      </div>
   )
}

export default AddRating;