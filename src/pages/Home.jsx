import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@bigbinary/neetoui";

import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import ViewHistory from "../components/ViewHistory";
import MovieDetailsModal from "../components/MovieDetailsModal";
import Spinner from "../components/Spinner";
import FilterDropdown from "../components/FilterDropdown";
import useDebounce from "../hooks/useDebounce";
import { getMovieDetails, searchMovies } from "../services/movieApi";

const HISTORY_STORAGE_KEY = "cinesearcher-view-history";

const defaultQueries = ["Batman", "Avengers", "Friends", "Spider", "Dune"];

const getRandomDefaultQuery = () =>
  defaultQueries[Math.floor(Math.random() * defaultQueries.length)];

const getStoredHistory = () => {
  const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!storedHistory) return [];

  try {
    return JSON.parse(storedHistory);
  } catch {
    return [];
  }
};

const saveHistory = history => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
};

const Home = () => {
  const historyRouter = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("q") || getRandomDefaultQuery();

  const [searchValue, setSearchValue] = useState(initialSearchQuery);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [history, setHistory] = useState(getStoredHistory);
  const [activeMovieId, setActiveMovieId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [selectedTypes, setSelectedTypes] = useState({
    movie: true,
    series: true,
  });

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const selectedType =
    selectedTypes.movie && !selectedTypes.series
      ? "movie"
      : selectedTypes.series && !selectedTypes.movie
        ? "series"
        : "all";

  const handleSearchChange = value => {
    setSearchValue(value);
    setPage(1);

    if (value.trim()) {
      historyRouter.push(`/?q=${encodeURIComponent(value)}`);
    } else {
      historyRouter.push("/");
    }
  };

  const handleTypeChange = type => {
    setSelectedTypes(previousTypes => ({
      ...previousTypes,
      [type]: !previousTypes[type],
    }));

    setPage(1);
  };

  const handleViewDetails = async imdbID => {
    try {
      setIsDetailsLoading(true);

      const data = await getMovieDetails(imdbID);

      setSelectedMovie(data);
      setActiveMovieId(data.imdbID);

      setHistory(previousHistory => {
        const alreadyExists = previousHistory.some(
          movie => movie.imdbID === data.imdbID
        );

        if (alreadyExists) {
          saveHistory(previousHistory);
          return previousHistory;
        }

        const updatedHistory = [...previousHistory, data];
        saveHistory(updatedHistory);

        return updatedHistory;
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteHistoryItem = imdbID => {
    setHistory(previousHistory => {
      const updatedHistory = previousHistory.filter(
        movie => movie.imdbID !== imdbID
      );

      saveHistory(updatedHistory);

      return updatedHistory;
    });

    if (activeMovieId === imdbID) {
      setActiveMovieId(null);
    }
  };

  const handleClearHistory = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearHistory = () => {
    setHistory([]);
    saveHistory([]);
    setActiveMovieId(null);
    setIsClearModalOpen(false);
  };

  useEffect(() => {
    const getMovies = async () => {
      if (!debouncedSearchValue.trim()) {
        setMovies([]);
        setError("");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await searchMovies(debouncedSearchValue, page, {
          year: yearFilter,
          type: selectedType,
        });

        setTotalResults(Number(data.totalResults || 0));

        const sortedMovies = [...(data.Search || [])].sort((a, b) => {
          const yearA = Number(a.Year.slice(0, 4));
          const yearB = Number(b.Year.slice(0, 4));

          return yearA - yearB;
        });

        setMovies(sortedMovies);
        setError("");
      } catch (err) {
        setMovies([]);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [debouncedSearchValue, page, yearFilter, selectedType]);

  return (
    <main className="page-wrapper">
      <section className="movies-section">
        <div className="search-filter-row">
          <SearchBar value={searchValue} onChange={handleSearchChange} />

          <button
            type="button"
            className="filter-icon-button"
            onClick={() => setIsFilterOpen(previousValue => !previousValue)}
            aria-label="Open filters"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
          </button>

          <FilterDropdown
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            year={yearFilter}
            onYearChange={value => {
              setYearFilter(value);
              setPage(1);
            }}
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
          />
        </div>

        {isLoading && (
          <div className="spinner-wrapper">
            <Spinner />
          </div>
        )}

        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {movies.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(currentPage => currentPage - 1)}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              type="button"
              disabled={page >= Math.ceil(totalResults / 10)}
              onClick={() => setPage(currentPage => currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <ViewHistory
        history={history}
        activeMovieId={activeMovieId}
        onSelectMovie={handleViewDetails}
        onDeleteMovie={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {isDetailsLoading && (
        <div className="details-loader">
          <Spinner />
        </div>
      )}

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {isClearModalOpen && (
        <div className="modal-overlay">
          <section className="alert-modal">
            <h2>Clear view history?</h2>

            <p>
              Are you sure you want to remove all items from your view history?
            </p>

            <div className="alert-actions">
              <Button
                label="Cancel"
                className="alert-btn alert-btn-secondary"
                onClick={() => setIsClearModalOpen(false)}
              />

              <Button
                label="Clear all"
                className="alert-btn alert-btn-danger"
                onClick={confirmClearHistory}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Home;