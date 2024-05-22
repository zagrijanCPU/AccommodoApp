import { useNavigate } from "react-router-dom";
import { baseUrl, storedToken } from "../App";


// Login.jsx
export const login = async (formData) => {
   try {
      const response = await fetch(`${baseUrl}/api/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
      })

      if (response.ok) {
         const data = await response.json();
         console.log(data);
         sessionStorage.setItem("token", data.token);
         sessionStorage.setItem("role", data.role);
         return true;
      }
      else {
         const message = await response.json();
         setErrorMessage(true, message.message);
         return false;
      }
   } catch (error) {
      console.log("Error: ", error);
      return false;
   }
}

// Register.jsx
export const userExists = async (userName, email) => {
   const data = { korisnickoIme: userName, email: email };
   console.log(data);
   const response = await fetch(`${baseUrl}/api/data/checkUser`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   console.log(response);
   if (response.ok) {
      return true;
   } else {
      return false;
   }
};

export const setErrorMessage = (error, message) => {
   if (error) {
      var errorMessage = document.querySelector(".error-message");
      errorMessage.innerHTML = message;
      errorMessage.style.color = "red";
   } else {
      var errorMessage = document.querySelector(".error-message");
      errorMessage.innerHTML = "";
   }
};

export const uloge = async () => {
   const response = await fetch(`${baseUrl}/api/data/uloge`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (response.ok) {
      const data = await response.json();
      return data;
   }
};

// ShowAccommodation.jsx
export const getAccommodation = async (id) => {
   try {
      const response = await fetch(`${baseUrl}/api/data/getAccommodation?id=${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      })

      if (response.ok) {
         const data = await response.json();
         console.log(data);
         return data;
      }
   } catch (error) {
      console.log("Error: ", error);
   }
   return null;
}

export const getRequestTypes = async () => {
   if (storedToken) {
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
            // setRequestTypes(data);
            console.log(data);
            return data;
         }
      } catch (error) {
         console.log("Error: ", error);
         return null;
      }
   }
}

export const getUserId = async () => {
   if (storedToken) {
      const response = await fetch(`${baseUrl}/api/data/getUserId`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": storedToken
         }
      })

      if (response.ok) {
         const data = await response.json();
         // console.log(data);
         return data;
      }
   }
}

// AddAccommodation.jsx
export const getAccommodationTypes = async () => {
   const response = await fetch(`${baseUrl}/api/data/accommodationTypes`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      }
   })

   if (response.ok) {
      const data = await response.json();
      return data;
   }
   else {
      return null;
   }
};


// Home.jsx
export const getAccommodations = async () => {
   const response = await fetch(`${baseUrl}/api/data/allAccommodations`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json"
      }
   })

   if (response.ok) {
      const data = await response.json();
      return data;
   }
}


// TableView.jsx
export const handleCancelReservation = async (id) => {
   if (storedToken) {
      const response = await fetch(`${baseUrl}/api/data/cancelReservation?id=${id}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": storedToken
         }
      });

      if (response.ok) {
         alert('Your reservation is canceled');
         window.location.reload();
      }
   }
}

export const checkIfUserAddedRating = async (id) => {
   if (storedToken) {
      try {
         const response = await fetch(`${baseUrl}/api/data/addedRating?id=${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         const data = await response.json();
         return data.addedRating;
      } catch (error) {
         console.log("Error: ", error);
      }
   }
}


export const deleteAccommodation = async (id) => {
   if (storedToken) {
      try {
         const response = await fetch(`${baseUrl}/api/data/deleteAccommodation?id=${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         if (response.ok) {
            alert(`[id=${id}]: Accommodation is removed!`);
            window.location.reload();
         }
      } catch (error) {
         console.log("Error: ", error);
      }
   }
}

export const deleteUser = async (id) => {
   if (storedToken) {
      try {
         const response = await fetch(`${baseUrl}/api/data/deleteUser?id=${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": storedToken
            }
         })

         if (response.ok) {
            alert(`[id=${id}]: User is removed!`);
            window.location.reload();
         }         
      } catch (error) {
         console.log("Error: ", error);
      }
   }
}