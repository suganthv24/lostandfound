PRD — Auth & User System (Developer 1)
Project context
You are building the authentication and user management backend module for a college-based platform. This is a Node.js + Express + MongoDB backend. Two other developers are building separate modules that depend entirely on your authMiddleware and User model — so your integration contracts are critical.

Tech stack

Runtime: Node.js
Framework: Express.js
Database: MongoDB via Mongoose
Auth: JSON Web Tokens (jsonwebtoken)
Email: Nodemailer
Env management: dotenv
Validation: express-validator or manual validation

Install all of these: npm install express mongoose jsonwebtoken nodemailer dotenv express-validator

Folder structure
Create this exact structure inside /auth:
/auth
  ├── auth.controller.js       ← request handlers
  ├── auth.routes.js           ← route definitions
  ├── auth.service.js          ← business logic
  ├── auth.middleware.js       ← JWT verification middleware
  ├── otp.model.js             ← OTP mongoose schema
  ├── user.model.js            ← User mongoose schema
  ├── college.model.js         ← College mongoose schema

Schema definitions
College (college.model.js)
js{
  _id: ObjectId,
  name: String (required),
  domains: [String] (required),   // e.g. ["@abc.edu", "@student.abc.edu"]
  createdAt: Date (default: Date.now)
}
OTP (otp.model.js)
js{
  email: String (required, unique),
  otp: String (required),
  expiresAt: Date (required),
  used: Boolean (default: false)
}
Add a TTL index on expiresAt so MongoDB auto-deletes expired OTPs: otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
User (user.model.js)
js{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required, 10 digits),
  collegeId: ObjectId (ref: 'College', required),
  role: String (enum: ['student', 'faculty'], required),
  isVerified: Boolean (default: false),
  createdAt: Date (default: Date.now)
}

API specifications
GET /colleges
Purpose: Return list of all colleges with their allowed email domains.
Auth required: No
Response 200:
json[
  {
    "_id": "college_id_here",
    "name": "ABC Engineering College",
    "domains": ["@abc.edu", "@student.abc.edu"]
  }
]

POST /auth/validate-email
Purpose: Step 1 of signup — verify that the email belongs to the selected college's allowed domains.
Auth required: No
Request body:
json{
  "email": "user@abc.edu",
  "collegeId": "college_id_here"
}
Logic:

Find college by collegeId. If not found → 404 with { success: false, message: "College not found" }
Check if the email ends with any of college.domains
Reject if email is @gmail.com, @yahoo.com, or any non-college domain

Response 200 (valid):
json{ "valid": true }
Response 400 (invalid):
json{ "valid": false, "message": "Invalid college email" }

POST /auth/send-otp
Purpose: Step 2 — generate and email a 6-digit OTP.
Auth required: No
Request body:
json{ "email": "user@abc.edu" }
Logic:

Generate a cryptographically random 6-digit OTP (crypto.randomInt(100000, 999999))
Delete any existing OTP record for this email (upsert pattern)
Save new OTP with expiresAt = Date.now() + 5 * 60 * 1000 (5 minutes)
Send email via Nodemailer with subject "Your OTP" and body "Your OTP is: 482931. Valid for 5 minutes."

Response 200:
json{ "message": "OTP sent successfully" }
Error 500 if email sending fails.

POST /auth/verify-otp
Purpose: Step 3 — verify the OTP entered by the user.
Auth required: No
Request body:
json{
  "email": "user@abc.edu",
  "otp": "482931"
}
Logic:

Find OTP record by email
If not found → 400 "OTP not found or expired"
If otp.used === true → 400 "OTP already used"
If Date.now() > otp.expiresAt → 400 "OTP expired"
If otp.otp !== inputOtp → 400 "Invalid OTP"
Mark otp.used = true, save
Store verified email in a temporary in-memory set OR create a short-lived emailVerified flag in a separate collection (your choice — keep it simple)

Response 200:
json{ "verified": true }

POST /auth/register
Purpose: Step 4 — create the user account after OTP is verified.
Auth required: No
Request body:
json{
  "name": "Suganth",
  "email": "user@abc.edu",
  "phone": "9876543210",
  "collegeId": "college_id_here",
  "role": "student"
}
Logic:

Check that this email was OTP-verified (from step 3). If not → 403 "Email not verified"
Check if user already exists by email → 409 "User already exists"
Validate phone: must be exactly 10 digits
Create and save the user with isVerified: true
Generate JWT: jwt.sign({ userId, email, collegeId }, JWT_SECRET, { expiresIn: '7d' })
Clear the OTP/verified session for this email

Response 200:
json{
  "token": "jwt_token_here",
  "user": {
    "name": "Suganth",
    "email": "user@abc.edu"
  }
}

POST /auth/login
Purpose: Login for existing users using OTP (no password system).
Auth required: No
Request body:
json{ "email": "user@abc.edu" }
Logic:

Check if user exists by email. If not → 404 "User not found"
Trigger OTP send (reuse send-otp service logic)
Client then calls verify-otp and finally hits a POST /auth/login/verify endpoint

POST /auth/login/verify (create this too):
json{ "email": "user@abc.edu", "otp": "482931" }

Verify OTP (same logic as verify-otp)
Find user by email
Generate and return JWT

Response 200:
json{
  "token": "jwt_token_here",
  "user": { "name": "Suganth", "email": "user@abc.edu" }
}

Auth middleware (auth.middleware.js)
This is the most critical piece — other developers depend on it.
js// Usage: router.get('/protected', authMiddleware, controller)
Logic:

Extract token from Authorization: Bearer <token> header
If missing → 401 "No token provided"
Verify with jwt.verify(token, JWT_SECRET)
If invalid/expired → 401 "Invalid or expired token"
Attach to request:

jsreq.user = {
  userId: decoded.userId,
  email: decoded.email,
  collegeId: decoded.collegeId
}

Call next()

Export this middleware as the default export. Other devs will import it directly.

Standard error response format
All error responses must follow this exact shape:
json{
  "success": false,
  "message": "Descriptive error message"
}
All success responses should include "success": true where not overridden by domain-specific shape.

Security requirements — non-negotiable
RequirementImplementationOTP expiry5 minutes, enforced at verify timeOne-time OTPMark used: true immediately after verifyJWT expiry7 daysBlock personal emailsReject @gmail.com, @yahoo.com, @hotmail.com, @outlook.com explicitlyReject unverified usersGuard register behind OTP checkInput validationValidate all fields — email format, phone is 10 digits, role is enum

Environment variables required
Create a .env with these keys (share with team):
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_super_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password

Integration contract (DO NOT CHANGE THESE SHAPES)
Other developers' modules will break if you change these:
req.user shape (from middleware):
jsreq.user = {
  userId: String,     // MongoDB _id as string
  email: String,
  collegeId: String   // MongoDB _id of college as string
}
User model fields other devs will query:

userId (_id)
collegeId
role
name
email


Out of scope — do NOT build

Item posting, listing, or search
Contact or messaging between users
Any frontend / UI
Admin panel


Definition of done checklist

 GET /colleges returns college list
 POST /auth/validate-email correctly rejects non-college emails
 POST /auth/send-otp sends real OTP email and stores with expiry
 POST /auth/verify-otp enforces one-time use and expiry
 POST /auth/register creates user, returns JWT
 POST /auth/login + POST /auth/login/verify work end to end
 authMiddleware attaches correct req.user shape
 All errors return { success: false, message: "..." }
 Personal email domains are blocked
 JWT expires in 7 days, OTP in 5 minutes