import useFavouritesStore from "../stores/favouritesStore";
import { Tooltip } from "@bigbinary/neetoui";

const FALLBACK_POSTER =
  "https://placehold.co/300x450/e5e7eb/111827?text=No+Image";

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

const poster = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;
const genres = movie.Genre ? movie.Genre.split(", ") : [];
const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

const isFavourite = favourites.some(
  favourite => favourite.imdbID === movie.imdbID
);

const handleFavouriteClick = () => {
  if (isFavourite) {
    removeFavourite(movie.imdbID);
  } else {
    addFavourite(movie);
  }
};
  return (
    <div className="modal-overlay">
      <section className="movie-modal">
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-title-row">
  <h2>{movie.Title}</h2>

<Tooltip
  content={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
  position="right"
>
  <button
    type="button"
    className={isFavourite ? "favourite-button active" : "favourite-button"}
    onClick={handleFavouriteClick}
  >
    {isFavourite ? "★" : "☆"}
  </button>
</Tooltip>
</div>

        <div className="genre-list">
          {genres.map(genre => (
            <span key={genre}>{genre}</span>
          ))}
        </div>

        <div className="modal-content">
          <img src={poster} alt={movie.Title} />

          <div className="movie-details">
            <p className="plot">{movie.Plot}</p>

            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Actors:</strong> {movie.Actors}</p>
            <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Runtime:</strong> {movie.Runtime}</p>
            <p><strong>Language:</strong> {movie.Language}</p>
            <p><strong>Rated:</strong> {movie.Rated}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailsModal;