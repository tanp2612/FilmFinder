import { Button } from "@bigbinary/neetoui";

const FALLBACK_POSTER =
  "https://placehold.co/300x450/e5e7eb/111827?text=No+Image";

const MovieCard = ({ movie, onViewDetails }) => {
  const poster = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  return (
    <article className="movie-card">
      <img
        src={poster}
        alt={movie.Title}
        className="movie-poster"
        onError={event => {
          event.currentTarget.src = FALLBACK_POSTER;
        }}
      />

      <div className="movie-info">
        <h3>{movie.Title}</h3>

        <p>
          {movie.Type} • {movie.Year}
        </p>

        <Button
          label="View details"
          style="link"
          onClick={() => onViewDetails(movie.imdbID)}
        />
      </div>
    </article>
  );
};

export default MovieCard;