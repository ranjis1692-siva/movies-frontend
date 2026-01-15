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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

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

      const movies: MovieSuggestion[] = res.data.content.map((m: Movie) => ({ id: m.id, name: m.name }));

      if (pageNumber === 0) setSuggestions(movies);
      else setSuggestions(prev => [...prev, ...movies]);

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
      setRecentMovies(prev => {
        const filtered = prev.filter(m => m.id !== movie.id);
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
          onScroll={handleScroll}
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
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
};

export default MovieSearch;
