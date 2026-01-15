import React, { useState, useRef, type ChangeEvent } from "react";
import axios from "axios";
import MovieModal from "./MovieModal";
interface MovieSuggestion {
  id: number;
  name: string;
  thumbnailUrl?: string;
}
interface Movie extends MovieSuggestion {
  description?: string;
  releaseDate?: string;
  year?: number;
  genres?: string;
  actors?: string;
  directors?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  rating?: number;
  duration?: string;
}

const MovieSearch: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recentMovies, setRecentMovies] = useState<MovieSuggestion[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchSuggestions = async (q: string, pageNumber: number = 0) => {
    if (!q.trim()) {
      setSuggestions(recentMovies);
      setHasMore(false);
      return;
    }
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    try {
      const res = await axios.get("http://localhost:8080/api/movies/searchPaginated", {
        params: { searchText: q, page: pageNumber },
      });

      const movies: MovieSuggestion[] = res.data.content.map((m: Movie) => ({
        id: m.id,
        name: m.name,
        thumbnailUrl: m.thumbnailUrl,
      }));

      if (pageNumber === 0) setSuggestions(movies);
      else setSuggestions((prev) => [...prev, ...movies]);

      setHasMore(!res.data.last);
    } catch (err) {
      console.error(err);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    pageRef.current = 0;
    setHasMore(true);

    if (value.trim() === "") setSuggestions(recentMovies);
    else fetchSuggestions(value, 0);
  };

  const handleFocus = () => {
    if (searchText.trim() === "") setSuggestions(recentMovies);
  };
  const handleSelect = async (movie: MovieSuggestion) => {
    setSearchText(movie.name);
    setSuggestions([]);
    try {
      const res = await axios.get<Movie>(`http://localhost:8080/api/movies/${movie.id}`);
      setSelectedMovie(res.data);
      setRecentMovies((prev) => {
        const filtered = prev.filter((m) => m.id !== movie.id);
        return [movie, ...filtered].slice(0, 10);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
      hasMore &&
      searchText.trim() !== ""
    ) {
      const nextPage = pageRef.current + 1;
      fetchSuggestions(searchText, nextPage).then(() => {
        pageRef.current = nextPage;
      });
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#6A1B9A" }}>Movie Search</h2>
      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Search movies..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginTop: "4px",
            maxHeight: "250px",
            overflowY: "auto",
            backgroundColor: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          }}
        >
          {suggestions.map((movie) => {
            const isRecent = recentMovies.some((r) => r.id === movie.id) && searchText.trim() === "";
            return (
              <div
                key={movie.id}
                onClick={() => handleSelect(movie)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  backgroundColor: isRecent ? "#F3E5F5" : "#fff",
                  fontStyle: isRecent ? "italic" : "normal",
                }}
              >
                {movie.thumbnailUrl && (
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.name}
                    style={{
                      width: "40px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginRight: "10px",
                    }}
                  />
                )}
                <span style={{ flex: 1, fontWeight: isRecent ? 500 : 400 }}>{movie.name}</span>
                {isRecent && (
                  <span style={{ fontSize: "12px", color: "#6A1B9A", marginLeft: "8px" }}>
                    Recent
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
};

export default MovieSearch;
