import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [allBooks, setAllBooks] = useState([]); // All fetched books
  const [books, setBooks] = useState([]);       // Filtered books
  const [searchTerm, setSearchTerm] = useState(""); // Start empty
  const [hasSearched, setHasSearched] = useState(false); // Track first search
  const [sortBy, setSortBy] = useState("title");
  const [language, setLanguage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "eng", label: "English" },
    { code: "hin", label: "Hindi" },
    { code: "tel", label: "Telugu" },
    { code: "tam", label: "Tamil" },
    { code: "kan", label: "Kannada" },
    { code: "mal", label: "Malayalam" },
    { code: "fre", label: "French" },
    { code: "spa", label: "Spanish" },
    { code: "ger", label: "German" },
    { code: "ita", label: "Italian" },
    { code: "ara", label: "Arabic" },
    { code: "mar", label: "Marathi" },
  ];

  // Fetch books only when search is triggered
  const fetchBooks = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      const data = await res.json();
      setAllBooks(data.docs || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters & sorting locally
  useEffect(() => {
    let filtered = allBooks;

    // Language filter
    if (language) {
      filtered = filtered.filter(
        (book) => Array.isArray(book.language) && book.language.includes(language)
      );
    }

    // Sorting
    if (sortBy === "title") {
      filtered = filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "year") {
      filtered = filtered.sort((a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0));
    } else if (sortBy === "language") {
      filtered = filtered.sort((a, b) => (a.language?.[0] || "").localeCompare(b.language?.[0] || ""));
    }

    setBooks(filtered);
    setTotalPages(Math.ceil(filtered.length / booksPerPage));
    setCurrentPage(1); // Reset page when filters change
  }, [allBooks, sortBy, language]);

  // Pagination
  const lastIndex = currentPage * booksPerPage;
  const firstIndex = lastIndex - booksPerPage;
  const currentBooks = books.slice(firstIndex, lastIndex);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">
        📚 Book Finder
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          className="px-4 py-2 border rounded-lg w-64 shadow-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setHasSearched(true);
              fetchBooks(searchTerm);
            }
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-md"
        >
          <option value="title">Sort by Title</option>
          <option value="year">Sort by Year</option>
          <option value="language">Sort by Language</option>
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-md"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-lg text-indigo-700">Loading...</p>}

      {/* Fallback UI when nothing searched */}
      {!hasSearched && !loading && (
        <p className="text-center text-indigo-700 text-xl mt-20">
          🔍 Search to discover new books!
        </p>
      )}

      {/* Books Grid */}
      {hasSearched && !loading && currentBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentBooks.map((book, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/150x220?text=No+Cover"
                }
                alt={book.title}
                className="w-full h-60 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600 text-sm">
                {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
              </p>
              <p className="text-gray-500 text-sm">
                Year: {book.first_publish_year || "N/A"}
              </p>
              <p className="text-indigo-600 font-medium text-sm">
                Language:{" "}
                {book.language
                  ? book.language.join(", ").toUpperCase()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No books found */}
      {hasSearched && !loading && currentBooks.length === 0 && (
        <p className="text-center text-red-500 text-xl mt-20">
          ❌ No books found for "{searchTerm}"
        </p>
      )}

      {/* Pagination */}
      {hasSearched && !loading && currentBooks.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
