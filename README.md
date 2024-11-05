# Placement of markers on the map

   [DEMO LINK]()

*Requirements*

1. **Cat Image Gallery**:
    - Fetch cat images and associated data (e.g., breed, temperament) from the TheCatAPI.
    - Display the cat images in a responsive grid or masonry layout.
    - Include the cat's breed name as a caption below each image.
2. **Breed Filtering**:
    - Allow users to filter the displayed cats by breed.
    - Provide a dropdown or search input to select the desired breed.
    - Update the gallery to show only the cats that match the selected breed.
3. **Favoriting Cats**:
    - Implement a "Favorite" button or icon for each cat image.
    - Allow users to mark a cat as a favorite, and persist this information in the browser's local storage.
    - Visually differentiate the favorite cats from the non-favorite ones in the gallery.
    - Provide a way for users to view only their favorite cats.


Implement the following functionality:

- A marker with a number (1, 2, 3, etc.) should be added to each user click on the map. It should be possible to delete markers one by one or all at once.
- Implement the ability to drag and drop markers to update their position on the map. The marker number should remain unchanged.
- Implement clustering of markers if their number exceeds a certain threshold.

## Use technologies:

- `React`
- `TypeScript`
- `Firebase`
- `Google Maps`
- `Git`
- `GitHub`

There must be one main entity:

 A token that stores the following fields:

- Location (latitude, longitude).
- Time of creation (Timestamp).
- Marker number (Quest 1, Quest 2, etc.).
- ID of the next marker.

## Additional launch instructions:

- git clone 
- npm install
- npm start
