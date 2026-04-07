# 🎯 DEV 3 – CONTACT SYSTEM (FINAL TASK DOC)

---

## 📌 OBJECTIVE

Enable users to contact item owners securely via email  
WITHOUT exposing personal details publicly.

---

## 📦 PHASE 1: SETUP

### Tasks:
- Install dependencies:
  npm install nodemailer dotenv

---

### Create Files:

/services/emailService.js  
/controllers/contactController.js  
/routes/contactRoutes.js  

---

### .env

EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_app_password  

---

## 📦 PHASE 2: EMAIL SERVICE

### File:
services/emailService.js

---

### Task:

Create function:

sendEmail({ to, subject, text })

---

### Responsibility:
- Configure Gmail SMTP
- Send email
- Handle errors

---

### Test:
- Send test email → must work ✅

---

## 📦 PHASE 3: CONTACT API

### Endpoint:

POST /items/:id/contact

---

### File:
controllers/contactController.js

---

### Tasks:

1. Get itemId:
req.params.id  

2. Get message:
req.body.message  

3. Get sender:
req.user  

---

## 📦 PHASE 4: INTEGRATION

---

### Fetch Item (Dev 2):
Item.findById(itemId)

---

### Fetch Owner (Dev 1):
User.findById(item.userId)

---

### Validate:
- Item exists
- Owner exists

---

## 📦 PHASE 5: SEND EMAIL

---

### Call:

sendEmail({
  to: owner.email,
  subject: "Someone found your item",
  text: `
    Finder Email: ${sender.email}
    Phone: ${sender.phone || "Not provided"}
    Message: ${message}
  `
})

---

## 📦 PHASE 6: ROUTES

### File:
routes/contactRoutes.js

---

### Add:

POST /items/:id/contact

---

### Apply middleware:

authMiddleware

---

### Connect in app:

app.use("/", contactRoutes)

---

## 📦 PHASE 7: ERROR HANDLING

---

Handle:

- Item not found
- User not found
- No message
- No token

---

### Response:

{
  success: false,
  message: "Error message"
}

---

## 📦 PHASE 8: SECURITY RULES

---

- ❌ Do NOT expose owner email
- ❌ Do NOT expose phone
- ✅ Only send via email
- ✅ Only logged-in users allowed

---

## 📦 PHASE 9: TESTING

---

### Test:

1. Valid request → email sent ✅  
2. Invalid item ❌  
3. No token ❌  
4. Empty message ❌  

---

## 📦 PHASE 10: FINAL FLOW

---

1. User logs in (Dev 1)  
2. Item created (Dev 2)  
3. User clicks "I Found This"  
4. API triggered  
5. Email sent to owner ✅  

---

# ✅ FINAL CHECKLIST

- [ ] Email service working  
- [ ] Contact API working  
- [ ] Item + User fetched  
- [ ] Email sending working  
- [ ] Routes connected  
- [ ] Errors handled  
- [ ] Full flow tested  

---

# 🚀 BUILD ORDER

1. Setup  
2. Email service  
3. Contact API  
4. Integration  
5. Send email  
6. Test  
