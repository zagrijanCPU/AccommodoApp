import React, { useEffect, useState } from "react";
import { getAccommodationTypes, getBestAccommodations, getRecommendedLocations } from "../Functions";

import Slider from 'react-slick';
import '../../styles/CustomCarousel.css';
import { getImageSource } from "../../App";
import Loading from "../Loading/Loading";

const AllRecommendations = () => {

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

   const text = {
      "textAlign": "center",
      "margin": "0"
   }

   const [accommodationTypes, setAccommodationTypes] = useState([]);
   const [recommendedLocations, setRecommendedLocations] = useState([]);
   const [bestAccommodations, setBestAccommodations] = useState([]);
   const [loading, setLoading] = useState(true);

   const setter = async () => {
      setBestAccommodations(await getBestAccommodations());
      setAccommodationTypes(await getAccommodationTypes());
      setRecommendedLocations(await getRecommendedLocations());
      setLoading(false);
   }

   useEffect(() => {
      setter();

      console.log(bestAccommodations)
   }, []);


   return (
      <>
         {loading ?
            <Loading /> :
            <div className="container mt-5">
               <h3 className="text-center">Best accommodations</h3>
               <div className="container">
                  <div className="content">
                     <div className="container">
                        <Slider {...{
                           dots: true,
                           infinite: true,
                           speed: 500,
                           slidesToShow: bestAccommodations.length < 3 ? bestAccommodations.length : 3,
                           slidesToScroll: 1,
                        }}>
                           {bestAccommodations.map((item) => (
                              <a className='link' href={`/accommodation/${item.idsmjestaj}`} key={item.idsmjestaj}>
                                 <div className="container">
                                    <img src={getImageSource(item.profilnaslika)} alt={"slika"} style={img} />
                                    <p style={title}>{item.nazivsmjestaja}</p>
                                    <p style={text}>{item.grad} ({item.drzava})</p>
                                    <p style={text}>avg: {item.prosjek} ({item.brojocjena} ratings)</p>
                                 </div>
                              </a>
                           ))}
                        </Slider>
                     </div>
                  </div>
               </div>
            </div>
         }

         {loading ?
            <Loading /> :
            <div className="container mt-5">
               <h3 className="text-center">Search for accommodation type</h3>
               <div className="container">
                  <div className="content">
                     <div className="container">
                        <Slider {...{
                           dots: true,
                           infinite: true,
                           speed: 500,
                           slidesToShow: accommodationTypes.length < 3 ? accommodationTypes.length : 3,
                           slidesToScroll: 1
                        }}>
                           {accommodationTypes.map((item) => (
                              <a className='link' href={`/recommendation?naztipasmjestaja=` + item.naztipasmjestaja} key={item.idtipsmjestaja}>
                                 <div className="container">
                                    <p style={title}>{item.naztipasmjestaja}</p>
                                 </div>
                              </a>
                           ))}
                        </Slider>
                     </div>
                  </div>
               </div>
            </div>
         }

         {loading ?
            <Loading /> :
            <div className="container mt-5">
               <h3 className="text-center">Search for locations</h3>
               <div className="container">
                  <div className="content">
                     <div className="container">
                        <Slider {...{
                           dots: true,
                           infinite: true,
                           speed: 500,
                           slidesToShow: recommendedLocations.length < 3 ? recommendedLocations.length : 3,
                           slidesToScroll: 1
                        }}>
                           {recommendedLocations.map((item) => (
                              <a className='link' href={`/recommendation?grad=${item.grad}&drzava=${item.drzava}`} key={item.grad}>
                                 <div className="container">
                                    <p style={title}>{item.grad} ({item.drzava})</p>
                                 </div>
                              </a>
                           ))}
                        </Slider>
                     </div>
                  </div>
               </div>
            </div>
         }
      </>
   );
};

export default AllRecommendations;