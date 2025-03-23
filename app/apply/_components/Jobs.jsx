"use client";
import React, { useState } from "react";
import Link from "next/link";
import { JobCard } from "./JobCard";

const AllJobs = ({ jobs }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const color = ["lime", "sky", "pink"];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-9 bg-">
        {paginatedJobs.map((job, i) => (
          <Link key={job.id} href={`/apply/jobDetails/${job.id}`}>
            <JobCard job={job} color={color[i % 3]} />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 text-2xl m-3 p-2">
          <div className="join">
            {/* Previous Button */}
            <button
              className="join-item btn btn-outline m-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ❮
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`join-item btn ${
                  currentPage === index + 1
                    ? "btn-primary bg-teal-400 text-white"
                    : "btn-outline"
                } transition hover:bg-primary hover:text-white m-1 p-2 border-2 border-teal-400`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              className="join-item btn btn-outline m-1"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllJobs;
