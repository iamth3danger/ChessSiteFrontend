"use client";
import { MdChevronLeft, MdChevronRight} from "react-icons/md";

export enum SlideEnum {
    LEFT,
    RIGHT
}

interface SlideProps{
  side: SlideEnum
}

export default function Slide({ side }: SlideProps) {

  const slide = () => {
    const slider = document.getElementById("slider")!;
    slider.scrollLeft =
      side === SlideEnum.LEFT
        ? slider.scrollLeft - window.innerWidth * 0.85
        : slider.scrollLeft + window.innerWidth * 0.85;
  };

  return (
    <div
      className="inline-block opacity-70 cursor-pointer hover:opacity-100"
      onClick={slide}
    >
      {side === SlideEnum.LEFT ? (
        <MdChevronLeft size={100} color="white" />
      ) : (
        <MdChevronRight size={100} color="white" />
      )}
    </div>
  );
}
