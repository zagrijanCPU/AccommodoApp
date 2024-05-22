import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/CustomCalendar.css';

const CustomCalendar = (props) => {
   const [date, setDate] = useState(new Date());

   const intervals = props.intervals;

   const isWithinAnyInterval = (date) => {
      return intervals.some(({ start, end }) => date >= start && date <= end);
   };

   const tileClassName = ({ date, view }) => {
      if (view === 'month' && isWithinAnyInterval(date)) {
         return 'highlight-red';
      }
      return null;
   };

   return (
      <div className='row justify-content-center'>
         <h1 className='text-center h3'>Reservations</h1>
         <Calendar
            onChange={setDate}
            value={date}
            tileClassName={tileClassName}
            locale="en-US"
         />
      </div>
   );
};

export default CustomCalendar;
