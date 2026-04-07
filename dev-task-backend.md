# 🎯 BACKEND PRD – DEV 2 (ITEM SYSTEM)

---

## 📦 PHASE 1: PROJECT SETUP

### Tasks:
- Initialize Node.js project
- Install dependencies:
  - express
  - mongoose
  - dotenv
  - cors
  - multer (for image upload)
  - cloudinary (optional)

---

### Create Folder Structure:

/modules/items  
/middlewares  
/utils  

---

### Create Core Files:
- server.js / app.js
- .env

---

### Setup Express Server:
- Enable JSON parsing
- Setup CORS
- Connect MongoDB

---

## 📦 PHASE 2: DATABASE MODEL

### File:
modules/items/item.model.js

---

### Tasks:
- Create Item Schema

---

### Schema Fields:

- title (String, required)
- description (String, required)
- imageUrl (String, required)
- location (String, required)
- dateTime (Date, required)
- userId (ObjectId, required)
- collegeId (ObjectId, required)
- status ("active" | "resolved")
- createdAt (Date)

---

### Export Model

---

## 📦 PHASE 3: SERVICE LAYER (OPTIONAL BUT CLEAN)

### File:
modules/items/item.service.js

---

### Tasks:
- Create reusable DB functions:
  - createItem(data)
  - getItemsByCollege(collegeId)
  - getItemById(id)
  - deleteItem(id)
  - updateItemStatus(id)

---

---

## 📦 PHASE 4: CONTROLLER LOGIC

### File:
modules/items/item.controller.js

---

### 1. Create Item

Endpoint:
POST /items

Tasks:
- Extract data from req.body
- Get user from req.user
- Attach:
  - userId
  - collegeId
- Save item

---

### 2. Get All Items

Endpoint:
GET /items

Tasks:
- Fetch items where:
  collegeId == req.user.collegeId
- Sort by latest

---

### 3. Get Single Item

Endpoint:
GET /items/:id

Tasks:
- Find item by ID
- Return item

---

### 4. Delete Item

Endpoint:
DELETE /items/:id

Tasks:
- Check ownership:
  item.userId == req.user.userId
- Delete item

---

### 5. Update Status

Endpoint:
PATCH /items/:id/status

Tasks:
- Set:
  status = "resolved"

---

---

## 📦 PHASE 5: ROUTES

### File:
modules/items/item.routes.js

---

### Tasks:

Create routes:

- POST   /items
- GET    /items
- GET    /items/:id
- DELETE /items/:id
- PATCH  /items/:id/status

---

### Add Middleware:

- authMiddleware (from Dev 1)

---

---

## 📦 PHASE 6: IMAGE UPLOAD

---

### Option 1: Simple (MVP)
- Accept image URL from frontend

---

### Option 2: Proper Upload

### Files:
utils/cloudinary.js

---

### Tasks:
- Configure Cloudinary
- Upload image
- Return image URL

---

### Use multer:
- Accept file from frontend
- Upload to cloudinary

---

---

## 📦 PHASE 7: SEARCH & FILTER

---

### Endpoint:
GET /items?q=&location=

---

### Tasks:
- Search:
  - title contains q
  - description contains q
- Filter:
  - location match
- Always include:
  collegeId filter

---

---

## 📦 PHASE 8: SECURITY & RULES

---

### MUST IMPLEMENT:

- All routes protected using authMiddleware
- Only same college data accessible
- Only owner can delete/update

---

### Validation:

- Required fields check
- Invalid ID handling

---

---

## 📦 PHASE 9: ERROR HANDLING

---

### Tasks:
- Return consistent format:

{
  success: false,
  message: "Error message"
}

---

### Handle:
- Item not found
- Unauthorized access
- Invalid input

---

---

## 📦 PHASE 10: CONNECT TO MAIN SERVER

---

### File:
server.js / app.js

---

### Tasks:

- Import routes
- Use:

app.use("/items", itemRoutes)

---

---

## 📦 PHASE 11: TESTING (VERY IMPORTANT)

---

### Use Postman

---

### Test APIs:

1. POST /items  
2. GET /items  
3. GET /items/:id  
4. DELETE /items/:id  
5. PATCH /items/:id/status  

---

### Test Conditions:

- With valid token ✅  
- Without token ❌  
- Different college ❌  

---

---

## 📦 PHASE 12: INTEGRATION CHECK

---

### Ensure:

- req.user is coming from Dev 1
- collegeId is attached properly
- Dev 3 can access:
  GET /items/:id

---

---

# ✅ FINAL CHECKLIST

- [ ] Item model created
- [ ] Create item API working
- [ ] Get items (college filter) working
- [ ] Get single item working
- [ ] Delete item working
- [ ] Status update working
- [ ] Search working
- [ ] Auth middleware applied
- [ ] Image upload working

---

# 🚀 BUILD ORDER

1. Setup server  
2. Create model  
3. Create item API  
4. Get items API  
5. Get single item  
6. Delete API  
7. Status update  
8. Search  
9. Image upload  
10. Testing  

---

# 🧠 IMPORTANT NOTES

- Always use:
  req.user.collegeId → for filtering  
- Never expose other college data  
- Keep controller clean (use service if needed)
