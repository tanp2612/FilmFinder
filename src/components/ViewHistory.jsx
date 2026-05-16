const ViewHistory = ({
  history,
  activeMovieId,
  onSelectMovie,
  onDeleteMovie,
  onClearHistory,
}) => {
  return (
    <aside className="history-section">
      <div className="history-header">
        <h2>View history</h2>

        {history.length > 0 && (
          <button
            type="button"
            className="clear-history-button"
            onClick={onClearHistory}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="history-list">
        {history.map(movie => (
          <div
            key={movie.imdbID}
            className={
              movie.imdbID === activeMovieId
                ? "history-item active"
                : "history-item"
            }
          >
            <button
              type="button"
              className="history-title-button"
              onClick={() => onSelectMovie(movie.imdbID)}
            >
              {movie.Title}
            </button>

            <button
              type="button"
              className="delete-history-button"
              onClick={() => onDeleteMovie(movie.imdbID)}
              aria-label={`Delete ${movie.Title} from history`}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ViewHistory;