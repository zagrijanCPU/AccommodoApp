import React from "react";
import '../../styles/LoadingSpinner.css';

const Loading = () => {
   return (
      <div className="container loading-page">
         <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
         </div>
      </div>
   );
}

export default Loading;