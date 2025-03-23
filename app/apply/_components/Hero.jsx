import Image from "next/image";
import HeroImg from "@/public/images/hero.svg";
import React from "react";

const Hero = () => {
  return (
    <div className="pt-12 pb-8">
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 item-center gap-[2rem]">
          {/* content */}
          <div>
            <h1 className="text-[28px] sm:text-[35px] lg:text-[45px] xl:text-[60px] text-[#05264e] leading-normal lg:leading-relaxed font-extrabold">
              One Step Closer to your{" "}
              <span className="text-blue-500">Dream Job</span> <br />{" "}
            </h1>

            <p className="text-[#4f5e6f] text-3xl">
              Apply for the jobs of your interest and get the offer letter in
              the next step
            </p>
          </div>
          {/* image */}
          <div className="hidden lg:block">
            <Image src={HeroImg} alt="hero image" width={700} height={400} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
