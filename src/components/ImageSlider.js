import React, { useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import image1 from "../assest/images/Login.jpg"; // 이미지 파일의 실제 경로로 수정
import image2 from "../assest/images/register.jpg";
import image3 from "../assest/images/pw1.jpg";

const ImageSlider = () => {
  const SliderData = [
    {
      image: image1,
    },
    {
      image: image2,
    },
    {
      image: image3,
    },
    // 추가 이미지들...
  ];

  const [current, setCurrent] = useState(0);
  const length = SliderData.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(SliderData) || SliderData.length <= 0) {
    return null;
  }

  return (
    <div className="slider-container">
      <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
      <div className="image-container">
        {SliderData.map((slide, index) => (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && (
              <img src={slide.image} alt={`slide ${index}`} className="image" />
            )}
          </div>
        ))}
      </div>
      <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
    </div>
  );
};

export default ImageSlider;
