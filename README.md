# 📚 Book Finder React App

Live Demo: [book‑finder‑one‑sooty.vercel.app](https://book-finder-one-sooty.vercel.app/)

---

## 🔎 Overview

Book Finder is a React-based web application that allows users to search for books by title. It fetches data from the **OpenLibrary API**, displays results as cards with details such as cover image, author, first publish year, and language. Users can filter by language, sort results, and navigate via pagination.

---

## 🚀 Features

- Search for books by title  
- Sort results by:
  - Title
  - Year of first publication
  - Language  
- Filter books by language (English, Hindi, etc.)  
- Pagination — navigate between pages of results  
- Book cards with:
  - Book cover (or fallback image if unavailable)
  - Title
  - Authors
  - Publication year
  - Languages  
  - “View Details” link to OpenLibrary page  
- Responsive, neat UI with hover effects and smooth transitions  

---

## 🛠️ Tech Stack

| Component | Technology |
|----------|-------------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| API | OpenLibrary Search API |
| Deployment | Vercel |

---

## 📂 Project Structure

- **App.js**:  
  - Contains main logic: state management (`useState`), side effects (`useEffect`), search + fetch, filtering, sorting, pagination  
- **BookCard.js**:  
  - Renders each individual book’s card UI  
- **index.css / Tailwind setup**:  
  - Styles, responsive grid, hover effects  

---

## ⚙️ Setup & Usage

1. Clone repository:  
   ```bash
   git clone https://github.com/your‑username/book‑finder.git
   cd book‑finder
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Run locally:  
   ```bash
   npm start
   ```
4. Open in browser:  
   ```
   http://localhost:3000
   ```

---

## 🔗 API Reference

Using OpenLibrary Search API:

```
https://openlibrary.org/search.json?title={your query}
```

- `title`: the search string  
- Returned JSON includes fields: `docs` (array of books), `title`, `author_name`, `first_publish_year`, `language`, `cover_i`, etc.

---

## 📸 Visual & UI Notes

- Clean card‑based layout works well across different screen sizes.  
- Fallback image appears for books with no cover.  
- Hover animations and subtle scaling/shadows enhance user experience.  

---

## ✅ Improvements & Future Work

- Add more filters (genre, availability, etc.)  
- Support for searching by author, ISBN  
- Infinite scrolling as alternative to pagination  
- Option to save favorite books (local storage or user accounts)  
- Accessibility improvements (aria labels, keyboard navigation)  

---

## 🙏 Acknowledgements

- OpenLibrary for their public API  
- React.js and Tailwind CSS for tools and frameworks  
- Vercel for effortless deployment  

