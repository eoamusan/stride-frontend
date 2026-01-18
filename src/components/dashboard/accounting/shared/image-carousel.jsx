import { useState } from "react";

export default function ImageCarousel({ images = []}) {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="space-y-4">
        {/* Main Image */}
        <div className="overflow-hidden rounded-lg border bg-white p-4">
          <img
            src={images[selectedImage]}
            alt={`Image ${selectedImage + 1}`}
            className="max-h-40 w-full object-contain"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square w-24 overflow-hidden rounded-lg border-2 p-2 ${
                selectedImage === index ? 'border-[#254C00]' : ''
              }`}
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      </div>
  )
}