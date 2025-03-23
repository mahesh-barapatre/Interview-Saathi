import Image from "next/image";
import React from "react";

export const JobCard = ({ job, color }) => {
  return (
    <div className="relative transition-transform duration-300 hover:scale-105 border-white shadow-lg rounded-xl overflow-hidden border-[1px] border-opacity-20">
      <div className="min-h-60 p-3 max-h-60 bg-white">
        {/* Package & Location */}
        <p className="text-gray-600">
          Package: <span className="font-semibold"> 2-4 LPA</span>
        </p>
        <p className="text-gray-600 flex text-xs">
          exp: <span className="font-semibold"> 2-4 </span>
        </p>
        <p className="text-gray-600">
          Job Location: <span className="font-semibold">{job.location}</span>
        </p>

        {/* Job Role */}
        <h2 className="text-2xl font-semibold mt-2">{job.role}</h2>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {/* Company Info & Button */}
      <div
        className={`flex items-center justify-between bg-${color}-300 p-3 min-h-20 max-h-20`}
      >
        <div className="flex items-center gap-3">
          <img
            // src={job.companyLogo}
            src="https://frontendehubbucket.s3.ap-south-1.amazonaws.com/frontend/navbar/logo.svg"
            alt={job.company}
            className="h-16 w-16 rounded-full bg-white p-2"
          />
          <span className="font-semibold bg-gre">{job.company}</span>
        </div>
        <button className="btn btn-primary btn-sm bg-teal-700 text-white px-3 py-2 font-semibold rounded-full text-sm hover:shadow-lg transition-transform duration-300 hover:scale-105">
          Apply
        </button>
      </div>
    </div>
  );
};
