import React from 'react';
import Slider from 'react-slick';
import '../../styles/CustomCarousel.css';

const NextArrow = ({ onClick }) => {
   return (
      <div className="slick-arrow slick-next" onClick={onClick} style={{ ...arrowStyle, right: '10px' }}>
         &#9654;
      </div>
   );
};

const PrevArrow = ({ onClick }) => {
   return (
      <div className="slick-arrow slick-prev" onClick={onClick} style={{ ...arrowStyle, left: '10px' }}>
         &#9664;
      </div>
   );
};

const arrowStyle = {
   display: 'block',
   background: '#fff',
   borderRadius: '50%',
   cursor: 'pointer',
   boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
   position: 'absolute',
   top: '50%',
   transform: 'translateY(-50%)',
   zIndex: 1
};


const CustomCarousel = (props) => {
   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
   };

   const img = {
      "display": "flex",
      "margin": "0 auto",
      "height": "50%",
      "width": "50%",
      "borderRadius": "5%",
   }

   const title = {
      "textAlign": "center",
      "fontSize": "25px",
      "borderRadius": "5px",
   }

   const items = props.items;

   return (
      <>
         <div className="content">
            <div className="container">
               <Slider {...settings}>
                  {items.map((item) => (
                     <a className='link' href='/filteredAccommodations' key={item.id}>
                        <div className="container">
                           {/* <img src={"https://www.apartman-djakovo.com/galerija/sobe-certissa/certissa6.jpg"} alt={"slika"} style={img} /> */}
                           <p style={title}>{item.title}</p>
                        </div>
                     </a>
                  ))}
               </Slider>
            </div>
         </div>
      </>
   );
};

export default CustomCarousel;