import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

function getCroppedBlob(image, crop) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 1);
  });
}

const ImageUploadCrop = ({ onImageCropped }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [showCrop, setShowCrop] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
      setError("Image must be at least 150 x 150 pixels.");
      setImgSrc("");
      setShowCrop(false);
      return;
    }
    setError("");
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthInPercent },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(centerCrop(crop, width, height));
  };

  function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

  const handleCropDone = async () => {
  if (imgRef.current && crop?.width && crop?.height) {
    const pixelCrop = convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height);
    const croppedBlob = await getCroppedBlob(imgRef.current, pixelCrop);

    // Convert to base64
    const base64String = await blobToBase64(croppedBlob);

    // You can pass base64String to parent if needed
    // onImageCropped(base64String);

    // Or keep passing the Blob if you want to upload as file
    onImageCropped(base64String);

    setShowCrop(false);
    setImgSrc("");
  }
};

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />
      {showCrop && imgSrc && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowCrop(false)}></div>
          <div className="bg-white p-4 rounded shadow-lg z-10">
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={ASPECT_RATIO}
              keepSelection
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop"
                style={{ maxHeight: "70vh" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <button
              className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
              onClick={handleCropDone}
            >
              Crop & Use Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCrop;