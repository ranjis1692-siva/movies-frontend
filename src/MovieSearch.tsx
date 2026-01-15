import React, { useState, useRef, type ChangeEvent } from "react";
import axios from "axios";
import MovieModal from "./MovieModal";
interface MovieSuggestion {
  id: number;
  name: string;
}
interface Movie extends MovieSuggestion {
  description?: string;
  releaseDate?: string;
}

const MovieSearch = () => {
  const [searchText,setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie|null>(null);
  const [recentMovies,setRecentMovies] = useState<MovieSuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get("http://localhost:8080/api/movies/searchByText", {
        params: { searchText: q },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setSuggestions(recentMovies);
    } else {
      fetchSuggestions(value);
    }
  };
  const handleFocus = () => {
    if (searchText.trim() === "") {
      setSuggestions(recentMovies);
    }
  };
  const handleSelect = async (movie: MovieSuggestion) => {
    setSearchText(movie.name);
    setSuggestions([]);
    try {
      const res = await axios.get<Movie>(`http://localhost:8080/api/movies/${movie.id}`);
      setSelectedMovie(res.data);
      setRecentMovies(prev => {
        const filtered = prev.filter(m => m.id !== movie.id);
        const updated = [movie, ...filtered];
        return updated.slice(0, 10); 
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Movie Search</h2>
      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Search movies..."
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "4px",
            borderRadius: "4px",
          }}
        >
          {suggestions.map(movie => (
            <div
              key={movie.id}
              onClick={() => handleSelect(movie)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {movie.name}
            </div>
          ))}
        </div>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default MovieSearch;
