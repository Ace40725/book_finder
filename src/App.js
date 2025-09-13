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

  const getCoverUrl = (coverId, size="L") => {
    if(coverId === undefined) return false
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }
    const getOpenLibraryUrl = (book) => {
    return `https://openlibrary.org${book}`
  }
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
          onChange={(e) =>{setSearchTerm(e.target.value);fetchBooks(e.target.value);setHasSearched(true);}}
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
  className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 hover:scale-[1.02] transition-all duration-300 flex flex-col"
>
  {/* Book Cover */}
  <div className="relative flex justify-center align-center w-full h-60 mb-4 overflow-hidden rounded-lg ">
    <img
      src={getCoverUrl(book.cover_i) || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIPEhISERQQFhUWEhUWFRUXFR0VEg8YFhYWFhUVFhUYHSggGBolGxYVIjEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOAA4AMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAgQBAwUGB//EAD8QAAIBAgQCCAMGBAMJAAAAAAABAgMRBBIhMQVRBhNBYXGBkbEiMqFCUsHR4fAUMzRyFmLxFSMkU3OCkqLC/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APr2ZjMzAAzmYzMwAM5mMzMADOZjMzAAzmYzMwAM5mMzMADOZjMzAAzmYzMwAM5mMzMADOZjMzAAzmYzMwAM5mMzMADOZjMzAAzmYzMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQMA3unGKvJ+bdkao1KUvlnH1AiDd1D7GiLpPkBrBlowAAAAAAAAAAAAAAAAAAAAAAAAAAAAnSV2jXOaWraQwmIUm7di3AodIKzcox7Er+bOZCDk7JNvuV2buJ1c1Wb77emh2ujdK1Ny7XL6L9sDhKU4ffj6o30+KVY/av4pM9ZKKe6TKtXh1KW8I+WnsBx6fHJfajF+DsWIcYpP5oyXlf2NtXgNN7Oa87r6lSr0fmvlnF+Kt+YF2GJoy2ml529zcqKezTOBW4VWhq43Xc7/QpRm1s2vDQD1Tos1mjgeNlUzRk75Umn225Mt1t2BrAAAAAAAAAAAAAAAABicrJvkc6ri5S7l3fmBeq14x3fl2lSrjW/l09yqAMyk3q22dHhitGUu/2RzToVHkw7/tf/ALf6gcGc7tvm2/U9fwmnlo01/lv66/ieNgrtLm0vU95CNklyVgJAAAAAB4jFyTnNrbPK3qeyxVTJCUuUW/RHhLgeg6Nw0nLvS9Ff8UXpu7Zq4LHLQi+d5fUmAAAAAAAAAAAAAAAABicbprmjkSjZ2Z2Chj6dnm5+4FUAAEr6Fvj88tJR5yS8kr/kasHG84+N/TU1dJavxQjyTfq/0Aq8Gp561Nf5r+iue2PIdG2oznUltCm234/tm3iHSGc9KXwrn9p/kB6hTV7XV1uu1eRI8RwrGulVU23Z6S70+38T2VbERgs0pJLm3+7gbTDdtzhY3pJFaUo5u96R9N2cLF8QqVvnk2uW0V5Aek41jYuhUyST1UG1tdvVX8Dydzo4z4MNRj9+Upv2XuilgYZ6kI85L31A9hCGSnGPKMUajfiXsaAAAAAAAAAAAAAAAAABrxFPNFr08TYAOMDfjKdpdz1/M0AXOFx+Jvkvc4/HKuatPutH0X5ne4VH4W+b9jyeJq5pylzk39QOzwGiqtOtTUlGUsvfeK/UVuj1aO2WXg7P6nCUrarT3LlHi1eG1Sfm7r6gSr4GrD5oTXfbT1RpnUct23bTV3t3HSo9J6y+ZQl5Wf0LH+3qFT+bR81aX5MDhmUr6czt5cDU2lKm++6X1uidHhFOMo1FWpyhGSbu1std0wKXSN2nCn9ylFef7sY6OU81dP7qb+lvxKfFcSqtapNbOWnelovY6/RGn/Mn4RXu/wAAO1iHqaiVR3bIgAAAAAAAAAAAAAAAAAABoxlPNHvWv5nNOycrEU8smvTwAvcMqq2XtT9bnLx/AJZm6TjZu+V6NeHcThBvZNl+hRmt5NdydwPN1eF1o705eWvsVJxcd014qx7yFVolKqpaSin46+4HgLi57Wrw7Dz3pxXh8PsU6vRujL5Zzj5qS+oHlrmDvVui818k4PxTT/Eo1uB4iP2G/wC1p/qBQuev6M08uHzfelJ+mi9jzFLh9WUsqpzv3ppLxbPaUKHVUow5RS8X2gQAAAAAAAAAAAAAAAAAAAAACM6alukyQAxGKWysZAAAAAAAMptE1VfM1gDcsQyE5tkAAAAAAAAAAAAAAAAAAAAAqU+I05VXRTedbpqyfg+0tnlK+ClVxGJdNtVKbjKHe+QHo8bjYUVFzb+KWVWV9SWLxcKMc1SSivq+5LtPOcT4gsRSoPaSrxU4/ddn9C5Vgq2OcZ6qnTvGL2vpr37/AEAtUOP0JtRzOLe2aLin5nTKnFMLCpSmpJaRbT7YtK6aNHR2s54em5b6q/NJtIC1PGwjUjSd80ldaaWXf5GunxSlKq6KbzptWtpdbq5Rxf8AXUP+nL/6ORi6T67E1YfNSqxn5Xd/wA9VjMXCjHPN2V0trvXkiWExMasFOF8r2urPTTY8/wAVrrFTjCPyQpOrLxcdF7erLfCcSqWCVR/ZjJ+Lu7L1AvU+KUpVXRTedNq1tLrVq5aqVFFOUmklu3okeUeEdPD08Qv5iqdZLXVqT29vVl/jlRVpYWF/93UlmfftZfV+oFn/ABFh72zSttmyvL6l3E46nTp9a3eGmq1vfbYq8QxdOjam6UpRcdowTiltZnM4jXp1ME+qi4wU1FLlrr7gX/8AEeH51P8AwZ1YSuk12pP1OLS4nVUV/wALUfwrXnpvsdqL0XZptyAyAAAAAAAAAAAAAAAAc3BYKcMRXqO2WdsuuunNdh0jQsbTz9Xnjn+727X9gOPxjgTnVjUpW1knNN2V0/mRc4pw6cpxrUZKNSKtr8s1yZenioRmqbklKWqj2vw9GbJySTb0SV2+SQHEr08ZXXVzVKnF6SkneTXJanXwuHjShGEdoqy/MUMRCpHPCScddezTcjhcZTq36uSlbe3YBUxGCnLFUqqtljBp663d+zzI4Lh8o1cTKaWSrtrdta3uvMvzxMIyjBySlLWMe1+Ap4mEpShGSco/Mu2PiBy+F8HdGlWjo5TzJO/2bNR9zRPhVZ0KND4UlK9R5uy+ltNd2egNEsbTU+rc4539nt5gc+XRuhZ/zO743pyNFHg05UFTqNRnTk3Tmne3br++R2sRXjTi5TaUVu3sr6FVcZw//Nh6gU8+Otky0b7dZf625+RCrwWawroxalJyUm3ot9bHYr4mFOOeUko6a9jvsbUwONCWOSSUMPokt32HYheyvvbXlftKlfilGEnGdSKkt0912mzC4+lVbVOcZNK7S7EBYAAAAAAAAAAAAAAABCvWVOMpvaKbfkeTWHmqSxmufrs7/sbt7+52+kNKpUpqnTi3mksz0tGK5/vsNL6PLLl66ta1rX+HwtyAj0hWanSxFPeDjJPnGVv0J8fxt6EVDetlUfB6v8F5k+DYafUSo1otWzRV9pRfKxR4Rw2sqsOui8lFSyPS0m3pbXz8kBa4q/4bCqlD5pJU48238z9/Ur4bD/weIpR+zVpqL5Z1+vub+J4GpiK8U80acI3U1bWT1087ehp4jwGWTNCpVnOLTjGTv29neBvx/wDW4b+2X4jhX9Xiv+0ToVZ4jDVXBpKm8+3wSs9HqaUq9HEV5woymptWd0lp2gd6pNRTk9km34I8k8NKdKeM1z9bnj/bF2/fgdPiFTEVqMoqjKMpSUbZk/h3bv46GY9Hlly9dWta1r/D3q3ICXHqyqYNzW0lTfrJHOq4/D9Tl6iebq0s3VpK9rZs1+etzasDX/hatBwk2prJt8ccybtr3X8ywsXiurVP+GfyKN3JW2tdoCrj6ThgKaclL4ou6d1q27Jnpafyx8F7Hn8RwurHBxpJZp51JpdmuxcoY/EXinhpJaJvOtFs2BzKlenTxeIdSnKaeVJKKlZ2jrZ7HX4TiqVRy6ulKDSV24KN1fa63KUo16OJrVIUZTjOyTuktFHX6HS4fiqtRtVKLppLRuSd3y0AugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZWMrAiCWVjKwIgllYysCIJZWMrAiCWVjKwIgllYysCIJZWMrAiCWVjKwIgllYysCIJZWMrAiCWVjKwIgllYysCIJZWMrAiCWVjKwP//Z"}
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
