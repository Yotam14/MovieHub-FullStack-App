import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <form className="w-full relative">
      <div className="relative flex justify-center">
        <div className="relative md:w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <input
            type="search"
            placeholder="Search for a movie..."
            className="p-4 pr-16 rounded-full bg-white text-gray-800 placeholder-gray-500 dark:text-gray-100 dark:placeholder-gray-100 dark:bg-gray-700"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
