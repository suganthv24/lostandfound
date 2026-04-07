# 🎯 FRONTEND PRD – DEV 2 (ITEM SYSTEM UI)

---

## 📦 PHASE 1: PROJECT SETUP

### Tasks:
- Create React app (Vite recommended)
- Install dependencies:
  - axios
  - react-router-dom
  - tailwindcss

---

### Create Folder Structure:

/src
  pages/
  components/
  services/
  hooks/
  context/
  utils/

---

### Create Files:
- App.jsx
- main.jsx
- routes.jsx

---

### Setup Routing (routes.jsx):

Routes:
- "/" → Home
- "/create" → CreateItem
- "/items/:id" → ItemDetails
- "/my-items" → MyItems

---

## 📦 PHASE 2: API LAYER

### File:
services/itemApi.js

---

### Implement APIs:

- createItem(data)
- getItems()
- getItemById(id)
- deleteItem(id)
- updateStatus(id)

---

### Create Axios Instance:

utils/apiClient.js

- Base URL setup
- Attach JWT token in headers

---

## 📦 PHASE 3: GLOBAL STATE (AUTH)

### File:
context/AuthContext.jsx

---

### Tasks:
- Store token
- Provide user globally
- Attach token to API calls

---

## 📦 PHASE 4: REUSABLE COMPONENTS

---

### 1. ItemCard.jsx

Props:
- item

Display:
- image
- title
- location
- date

---

### 2. SearchBar.jsx

Features:
- input field
- search trigger

---

### 3. ImageUpload.jsx

Features:
- upload image
- preview image
- return URL

---

### 4. Navbar.jsx

Features:
- navigation links
- logout button

---

### 5. Loader.jsx

Simple loading spinner

---

## 📦 PHASE 5: HOME PAGE

### File:
pages/Home.jsx

---

### Tasks:
- Call getItems()
- Display list using ItemCard
- Add SearchBar
- Handle loading state

---

## 📦 PHASE 6: CREATE ITEM PAGE

### File:
pages/CreateItem.jsx

---

### Tasks:
- Form fields:
  - title
  - description
  - location
  - date/time
  - image upload

---

### On Submit:
- Call createItem()
- Redirect to Home

---

## 📦 PHASE 7: ITEM DETAILS PAGE

### File:
pages/ItemDetails.jsx

---

### Tasks:
- Get item ID from URL
- Call getItemById()

---

### Display:
- full image
- description
- location
- date

---

### Button:
"I Found This"

👉 Call:
POST /items/:id/contact (Dev 3 API)

---

## 📦 PHASE 8: MY ITEMS PAGE

### File:
pages/MyItems.jsx

---

### Tasks:
- Fetch user items
- Show list

---

### Actions:
- Delete item
- Mark as resolved

---

## 📦 PHASE 9: SEARCH & FILTER

---

### Tasks:
- Add query search
- Call:
GET /items?q=

---

### Integrate in:
Home.jsx

---

## 📦 PHASE 10: ERROR & LOADING HANDLING

---

### Tasks:
- Show Loader while fetching
- Show error messages
- Handle empty state

---

## 📦 PHASE 11: FINAL INTEGRATION

---

### Tasks:
- Connect all APIs
- Add auth token to headers
- Test all flows:

Flow:
1. Login (Dev 1)
2. Create item
3. View items
4. View details
5. Contact (Dev 3)

---

## 📦 PHASE 12: UI POLISH (OPTIONAL)

---

### Tasks:
- Improve spacing
- Add hover effects
- Responsive design

---

# ✅ FINAL CHECKLIST

- [ ] Routing working
- [ ] API connected
- [ ] Create item working
- [ ] Feed working
- [ ] Details page working
- [ ] Contact button working
- [ ] Delete + status working
- [ ] Search working

---

# 🚀 BUILD ORDER

1. Setup + routing  
2. API layer  
3. Home page  
4. Create page  
5. Details page  
6. My items  
7. Search  
8. Polish  
