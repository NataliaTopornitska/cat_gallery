export interface Cat {
  id: string;
  breeds: Breed[];
  url: string;
  strcatThumb: string;
  strcat: string;
  imageUrl?: string;
}

export interface Breed {
  id: number;
  name: string;
  temperament?: string;
}

export interface FavoritesProps {
  favoriteCats: Cat[];
  onCatSelect: (cat: Cat) => void;
  onRemoveFavorite: (cat: Cat) => void;
}

export interface CatDetailProps {
  cat: Cat | null;
  onBack: () => void;
  numberOfSelectedCats: number;
  isFavorites: boolean;
}
