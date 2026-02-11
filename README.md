## Digital Wishbook – Shareable Template

This is a **front-end template** for a digital "wishbook" experience where people can submit birthday wishes (text, photo, video, voice note) and see them displayed in a gallery.  

**All data is stored in browser localStorage** – wishes persist across page refreshes and sessions. Media files (photos, videos, voice notes) are converted to base64 and stored alongside wish data.

---

### Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS**
- **shadcn-ui**
- **Framer Motion**

---

### 1. Getting started locally

- **Prerequisite**: Node.js and npm installed (use nvm if you like).

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Go into the project directory
cd digital-wishbook   # or your chosen folder name

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Then open the URL that Vite prints in the terminal (usually `http://localhost:5173`).

---

### 2. How the template works (localStorage)

- The main page is `src/pages/Index.tsx`, which renders the `WishesSection` component.
- `WishesSection` manages wishes using **localStorage for persistence**:
  - On mount, wishes are loaded from `localStorage` using the key `digital-wishbook-wishes`.
  - `WishForm` adds a new wish, converting media files to base64 for storage.
  - `WishGallery` displays wishes and allows editing/deleting.
  - All changes are automatically saved to `localStorage`.
- Media files (photos, videos, voice notes) are converted to base64 data URLs and stored in the wish data.
- There is **no network or database code** – all data persists in the browser's localStorage.

Relevant components:

- **`src/components/WishForm.tsx`**
  - Handles user input for name, message, and media (photo, video, voice).
  - Converts media files to base64 data URLs using `fileToBase64()` from `src/lib/localStorage.ts`.
  - On submit, it calls `onWishAdded(newWish)` with a `NewWish` object:
    - `sender_name`
    - `message`
    - `media_type`
    - `media_urls` (array of `{ type, url }` where `url` is a base64 data URL)

- **`src/components/WishesSection.tsx`**
  - Owns `wishes: Wish[]` state.
  - Loads wishes from localStorage on mount using `loadWishesFromStorage()`.
  - Automatically saves wishes to localStorage whenever the state changes using `saveWishesToStorage()`.
  - Converts the `NewWish` received from `WishForm` into a full `Wish` (adds `id` and `created_at`).
  - Passes `wishes` and `onChangeWishes` down to the gallery.

- **`src/components/WishGallery.tsx`**
  - Receives `wishes` as props and displays them in the masonry-style layout.
  - Supports editing and deleting wishes by updating the `wishes` array via `onChangeWishes`.
  - Changes are automatically persisted to localStorage by `WishesSection`.
  - Exports the `Wish` interface so you can reuse the type in your own API layer.

- **`src/lib/localStorage.ts`**
  - Utility functions for managing localStorage:
    - `fileToBase64(file)`: Converts File objects to base64 data URLs
    - `saveWishesToStorage(wishes)`: Saves wishes array to localStorage
    - `loadWishesFromStorage()`: Loads wishes array from localStorage
    - `clearWishesFromStorage()`: Clears all wishes from localStorage
  - Storage key: `digital-wishbook-wishes`

---

### 3. LocalStorage Details

**Storage Location:**
- All wishes are stored in the browser's `localStorage` under the key `digital-wishbook-wishes`.
- Data persists across page refreshes and browser sessions.
- Each browser/device has its own separate storage.

**Data Format:**
- Wishes are stored as a JSON array of `Wish` objects.
- Media files (photos, videos, voice notes) are converted to base64 data URLs and embedded in the JSON.
- Base64 data URLs have the format: `data:[mime-type];base64,[base64-encoded-data]`

**Storage Limitations:**
- localStorage typically has a 5-10MB limit per domain (varies by browser).
- Large media files will consume storage quickly.
- If storage is full, saving will fail silently (check browser console for errors).

**Clearing Data:**
- Users can clear data via browser settings or developer tools.
- You can programmatically clear using `clearWishesFromStorage()` from `src/lib/localStorage.ts`.

### 4. Connecting your own backend or database

If you want to replace localStorage with a backend, you can wire it up to:

- A REST API
- GraphQL
- Firebase / Supabase / your own Postgres/MySQL
- Any other data store

At a high level, you'll replace the **localStorage flows** with calls to your backend:

- **Where to plug in create logic**
  - In `WishesSection.tsx`, inside `handleWishAdded(newWish)`, replace:
    - Remove the `useEffect` that saves to localStorage
    - Instead, call your backend `POST /wishes` (or similar)
    - Upload media files to your storage service (S3, Cloudinary, etc.)
    - Get the created wish back (with its real ID and timestamps)
    - Store that response in state

- **Where to plug in read logic**
  - In `WishesSection.tsx`, replace the `useEffect` that loads from localStorage:
    ```ts
    useEffect(() => {
      async function loadInitialWishes() {
        const response = await fetch("/api/wishes");
        const data = await response.json(); // should match Wish[]
        setWishes(data);
      }
      loadInitialWishes();
    }, []);
    ```

- **Where to plug in update/delete logic**
  - In `WishGallery.tsx`, in `saveEdit` and `handleDelete`, replace the local updates with:
    - API calls to your backend (`PUT /wishes/:id`, `DELETE /wishes/:id`)
    - Update local state based on the success response

- **Media (photos, videos, voice)**
  - In `WishForm.tsx`, replace the base64 conversion with your upload logic:
    ```ts
    // Pseudocode inside handleSubmit of WishForm
    const uploadedUrls = await uploadMediaToYourBackendOrStorage(mediaItems);
    // uploadedUrls should be { type: string; url: string }[]
    // URLs should be publicly accessible (not base64)
    ```
  - Then pass those real URLs through `NewWish.media_urls` so your gallery shows assets hosted on your server or storage provider.

---

### 5. Sharing this template with others

To let someone else build a similar experience:

- They can **clone this repo**, run `npm install` and `npm run dev`, and they'll have:
  - Fully working UI
  - Data persistence via localStorage (survives page refreshes)
  - Placeholder images for demo purposes
- They can then:
  - Replace the localStorage logic in `WishesSection`/`WishGallery` with calls to their own backend.
  - Replace placeholder images with their own photos.
  - Optionally change branding, copy, and styling as needed.

Because there is no hard‑wired database or auth, they are free to connect it to **any stack** that can expose a simple API for:

- listing wishes
- creating a wish
- updating a wish
- deleting a wish

---

### 6. Build & production

To create a production build:

```sh
npm run build
```

This produces static assets in the `dist` directory, which you can deploy to any static host (Netlify, Vercel, S3, etc.).  

You are responsible for hosting and securing any backend or database you decide to plug into this template.

---

### 7. Notes on Supabase

The `supabase/` directory contains migration files from a previous version of this template. **These files are not currently used** - the application now uses localStorage for data persistence. If you want to use Supabase in the future, you can reference these migration files, but they are not required for the current localStorage-based implementation.
