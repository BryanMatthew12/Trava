import React from 'react'
import img1 from "../../assets/img/javalandscape.jpg";

const ImageBanner = () => {
  return (
    <div className="w-full max-w-6xl h-[200px] md:h-[300px] mt-[4rem]">
        <img
          src={img1}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
  )
}

export default ImageBanner