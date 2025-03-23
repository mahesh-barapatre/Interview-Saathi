"use client";
import React from "react";
import Hero from "../_components/Hero";
import AllJobs from "../_components/Jobs";
import { jobs } from "../_components/data";
import { Search } from "lucide-react";

import { useState } from "react";
import Header from "@/app/dashboard/_components/Header";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // 🔍 Filtering jobs based on search query
  const filter = () => {
    setFilteredJobs(
      jobs.filter(
        (job) =>
          ["role", "location", "company"].some((key) =>
            String(job[key] || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) ||
          (Array.isArray(job.skills) &&
            job.skills.some((skill) =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      )
    );
  };

  return (
    <div className="bg-cyan-50">
      <Header />
      <Hero />
      {/* search box */}
      <div className="bg-white border-2 border-blue-500 rounded-full w-1/3 text-center flex justify-center items-center overflow-hidden m-auto mb-9">
        <input
          className="w-full outline-none rounded-l-md bg-slate-50 p-3"
          placeholder="Search for Jobs, Company, Role etc"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          title="search box"
          type="text"
        />
        <button
          title="Press to Search"
          type="button"
          className="p-3 outline-none text-white bg-blue-500"
          onClick={() => {
            filter();
          }}
        >
          <Search />
        </button>{" "}
      </div>
      <AllJobs jobs={filteredJobs} />
    </div>
  );
};

export default Home;
