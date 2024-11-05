import { CatDetailProps } from './types';

const CatDetail: React.FC<CatDetailProps> = ({
  cat,

  isFavorites,
}) => {
  if (!cat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cat-details">
      <h2 className="cat-title">
        {cat.breeds.length > 0 ? cat.breeds[0].name : 'Unknown'}
      </h2>
      <img
        className="cat-image"
        src={cat.url}
        alt={cat.breeds.length > 0 ? cat.breeds[0].name : 'Cat'}
      />
      <div className="cat-info">
        <p className="temperament">
          <strong>Temperament:</strong>{' '}
          {cat.breeds.length > 0 ? cat.breeds[0].temperament : 'N/A'}
        </p>
      </div>
      {isFavorites && <p>This cat is one of your favorites!</p>}{' '}
    </div>
  );
};

export default CatDetail;
