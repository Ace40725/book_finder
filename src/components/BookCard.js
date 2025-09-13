import React from "react";

function BookCard({ book, getCoverUrl, getOpenLibraryUrl }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 hover:scale-[1.02] transition-all duration-300 flex flex-col">
      {/* Book Cover */}
      <div className="relative flex justify-center align-center w-full h-60 mb-4 overflow-hidden rounded-lg">
        <img
          src={
            getCoverUrl(book.cover_i) ||
            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
          }
          alt={book.title || "Book cover"}
          className="w-100 h-full object-cover rounded-md transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Book Info */}
      <h2 className="text-lg font-semibold text-red-700 font-extrabold line-clamp-2 mb-1">
        {book.title}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        Year: <span className="font-medium">{book.first_publish_year || "N/A"}</span>
      </p>
      <p className="text-sm text-indigo-600 font-medium mb-4">
        Language:{" "}
        {book.language ? book.language.join(", ").toUpperCase() : "Unknown"}
      </p>

      {/* Action Button */}
      <button
        onClick={() => window.open(getOpenLibraryUrl(book.key), "_blank")}
        className="mt-auto w-full py-2 px-4 rounded-lg border border-indigo-500 text-indigo-600 font-medium text-sm hover:bg-indigo-500 hover:text-white transition-colors duration-300"
      >
        View Details
      </button>
    </div>
  );
}

export default BookCard;
