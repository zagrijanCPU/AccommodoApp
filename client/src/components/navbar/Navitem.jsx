import React from "react";

function Navitem({path, text}) {
   return (
      
      <li className="nav-item">
         <a className="nav-link" href={path}>{text}</a>
      </li>
   );
}

export default Navitem;