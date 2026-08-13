import React, { useState } from "react";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { cartImg } from "../assets/index";

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // Use local banner images
    const data = [
        `${process.env.PUBLIC_URL || ''}/images/kids1.svg`,
        `${process.env.PUBLIC_URL || ''}/images/kids2.svg`,
        `${process.env.PUBLIC_URL || ''}/images/kids3.svg`,
        `${process.env.PUBLIC_URL || ''}/images/kids4.svg`,
    ];
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1));
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
    };
    return (
        <div className="w-full h-auto overflow-x-hidden">
            <div className="h-[650px] w-screen relative">
                <div
                    style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
                    className="w-[400vw] h-full flex transition-transform duration-1000"
                >
                    <img className="w-screen h-full object-cover flex-shrink-0 block" src={data[0]} alt="ImageOne" />
                    <img className="w-screen h-full object-cover flex-shrink-0 block" src={data[1]} alt="ImageTwo" />
                    <img className="w-screen h-full object-cover flex-shrink-0 block" src={data[2]} alt="ImageThree" />
                    <img className="w-screen h-full object-cover flex-shrink-0 block" src={data[3]} alt="ImageFour" />
                </div>
                <div className="absolute w-fit left-0 right-0 mx-auto flex gap-8 bottom-52">
                    <div
                        onClick={prevSlide}
                        className="w-14 h-12 border-[1px] border-gray-700 flex items-center justify-center hover:cursor-pointer hover:bg-gray-700 hover:text-white active:bg-gray-900 duration-300"
                    >
                        <HiArrowLeft />
                    </div>
                    <div
                        onClick={nextSlide}
                        className="w-14 h-12 border-[1px] border-gray-700 flex items-center justify-center hover:cursor-pointer hover:bg-gray-700 hover:text-white active:bg-gray-900 duration-300"
                    >
                        <HiArrowRight />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;