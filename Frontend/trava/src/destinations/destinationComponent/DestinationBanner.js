import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDestinationPictureById } from "../../slices/destination/destinationSlice";

const DestinationBanner = ({ bannerId }) => {
  const picture = useSelector(selectDestinationPictureById(bannerId));

  return (
    <div className="w-full max-w-6xl h-[200px] md:h-[300px] mt-[4rem]">
      {picture ? (
        <img
          src={picture} // Use the Base64 string directly
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </div>
  );
};

export default DestinationBanner;
