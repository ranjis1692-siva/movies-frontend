**TypeScript Design**
  - Created a MovieSuggestion interface that contains only the minimal fields required to render the dropdown list (for example: id, name, thumbnailUrl).
  - Created a Movie type that extends MovieSuggestion and includes additional movie-specific details such as description, cast, genre, rating, etc.
  - This separation keeps the dropdown lightweight while allowing richer data to be displayed in the movie detail card.

**UI Library**
  - The UI is built using Material UI (MUI), a widely adopted and well-maintained React UI library.
  - MUI components help ensure consistent styling, accessibility, and faster UI development.

**Infinite Scroll Implementation**
  - Implemented infinite scrolling for the movie search dropdown to efficiently handle large datasets.
  - Instead of loading all results at once, data is fetched page by page as the user scrolls.
  - 
    Flow:
        - The user enters a search term.
        - The search API is called immediately with the first page of results, which are rendered in the dropdown.
        - When the user scrolls to the bottom of the dropdown:
        - The next page is automatically fetched.
        - The new results are appended to the existing list.

    This approach:
        - Reduces database load
        - Minimizes memory usage
        - Improves performance and perceived responsiveness

**Movie Selection & Recent Searches**
  - When a user selects a movie from the dropdown:
  - A movie modal opens, displaying full movie details.
  - The selected movie is added to a Recent Movies list.
  - Recent movies are stored in localStorage to:
  - Preserve the user’s session within the same browser
  - Restore recent selections on page refresh
  - This approach avoids backend dependency while maintaining a smooth user experience for a single-user session.

**Why LocalStorage?**
  - No authentication or user-specific backend session is required.
  - Keeps recent searches scoped to the user’s browser.
  - Simple, performant, and sufficient for this use case.

