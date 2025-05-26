import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { selectDestinationPictureById } from "../../slices/destination/destinationSlice";


const DestinationBanner = ({ destination, bannerId }) => {
  // const imgSrc = getImageSrc(destination?.destination_picture);
  const picture = useSelector(selectDestinationPictureById(bannerId));

  useEffect(() => {
    console.log('nigga ', bannerId)
  }, [])
  
  return (
    <div className="w-full max-w-6xl h-[200px] md:h-[300px] mt-[4rem]">
      <img src={picture} alt="Banner" className="w-full h-full object-cover" />
    </div>
  );
};

export default DestinationBanner;
