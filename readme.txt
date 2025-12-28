# 🚀 BeyondChats Article Scraper & API

A Node.js application that scrapes articles from BeyondChats blog and provides a RESTful API to manage them using MongoDB.

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- 🕷️ **Web Scraping**: Automatically scrapes 5 oldest articles from BeyondChats
- 💾 **MongoDB Storage**: Stores articles in MongoDB database
- 🔄 **CRUD Operations**: Full Create, Read, Update, Delete functionality
- 🔍 **Search**: Search articles by title, author, or content
- 📡 **RESTful API**: Clean API endpoints for all operations
- ⚡ **Fast**: Built with Express.js for high performance

---

## 🔧 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - See installation below
- **npm** (comes with Node.js)
- **Terminal/Command Line** access

### Installing MongoDB

**For Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**For Windows:**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run installer, choose "Complete" setup
3. Install as Windows Service

**For Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
# Type 'exit' to quit
```

---

## 📦 Installation

### Step 1: Clone/Download the Project

```bash
# Navigate to your project folder
cd ~/Downloads/Task1
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server framework
- `mongoose` - MongoDB object modeling
- `axios` - HTTP client for scraping
- `cheerio` - HTML parser
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing

### Step 3: Create Environment File

Create a `.env` file in the project root:

```bash
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/beyondchats_articles
PORT=3000

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats_articles
```

---

## 📁 Project Structure

```
Task1/
├── server.js              # Main API server
├── scraper.js             # Web scraping logic
├── models/
│   └── Article.js         # MongoDB schema/model
├── .env                   # Environment variables (create this)
├── package.json           # Dependencies
├── package-lock.json      # Dependency lock file
├── node_modules/          # Installed packages
└── README.md             # This file
```

### File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express server with all API routes |
| `scraper.js` | Functions to scrape BeyondChats website |
| `models/Article.js` | Database schema defining article structure |
| `.env` | Configuration (database URL, port) |

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/beyondchats_articles

# Server Port
PORT=3000
```

**MongoDB URI Options:**

1. **Local MongoDB:**
   ```
   mongodb://localhost:27017/beyondchats_articles
   ```

2. **MongoDB Atlas (Cloud):**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/beyondchats_articles
   ```

---

## 🚀 Running the Application

### Step 1: Ensure MongoDB is Running

```bash
# Check MongoDB status
brew services list | grep mongodb

# If not running, start it:
brew services start mongodb-community@7.0

# Verify connection:
mongosh
```

### Step 2: Start the Server

```bash
node server.js
```

**You should see:**
```
✅ Connected to MongoDB!
==================================================
🚀 Server running on http://localhost:3000
==================================================
```

### Step 3: Test the Server

Open a new terminal and run:

```bash
curl http://localhost:3000/
```

**Expected response:**
```json
{
  "message": "🎉 BeyondChats Article API",
  "endpoints": {
    "POST /api/scrape": "Scrape articles",
    "GET /api/articles": "Get all articles",
    ...
  }
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. **Root - API Info**
```http
GET /
```
Returns API information and available endpoints.

---

#### 2. **Scrape Articles**
```http
POST /api/scrape
```

Scrapes 5 oldest articles from BeyondChats and saves to database.

**Example:**
```bash
curl -X POST http://localhost:3000/api/scrape
```

**Response:**
```json
{
  "success": true,
  "message": "Scraped 5 articles",
  "count": 5,
  "data": [...]
}
```

---

#### 3. **Get All Articles**
```http
GET /api/articles
```

Retrieves all articles from database.

**Example:**
```bash
curl http://localhost:3000/api/articles
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65abc123...",
      "title": "Chatbot Guide",
      "url": "https://beyondchats.com/blogs/chatbot-guide",
      "author": "John Doe",
      "date": "Dec 5, 2023",
      "tags": ["AI", "Chatbot"],
      "excerpt": "Learn about chatbots...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 4. **Get Single Article**
```http
GET /api/articles/:id
```

Get one article by its MongoDB ID.

**Example:**
```bash
curl http://localhost:3000/api/articles/65abc123def456
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "title": "Chatbot Guide",
    ...
  }
}
```

---

#### 5. **Search Articles**
```http
GET /api/articles/search/:term
```

Search for articles by keyword in title, author, or excerpt.

**Example:**
```bash
curl http://localhost:3000/api/articles/search/chatbot
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

#### 6. **Create Article**
```http
POST /api/articles
Content-Type: application/json
```

Create a new article manually.

**Request Body:**
```json
{
  "title": "New Article Title",
  "url": "https://example.com/article",
  "author": "John Doe",
  "date": "2024-01-01",
  "tags": ["tech", "ai"],
  "excerpt": "Article description"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "url": "https://test.com/article",
    "author": "Test Author"
  }'
```

---

#### 7. **Update Article**
```http
PUT /api/articles/:id
Content-Type: application/json
```

Update an existing article.

**Request Body:**
```json
{
  "title": "Updated Title",
  "excerpt": "Updated description"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/articles/65abc123 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

---

#### 8. **Delete Article**
```http
DELETE /api/articles/:id
```

Delete an article from database.

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/articles/65abc123
```

**Response:**
```json
{
  "success": true,
  "message": "Deleted"
}
```

---

## 🧪 Testing

### Using cURL (Command Line)

```bash
# 1. Scrape articles
curl -X POST http://localhost:3000/api/scrape

# 2. Get all articles
curl http://localhost:3000/api/articles

# 3. Search
curl http://localhost:3000/api/articles/search/chatbot
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL: `http://localhost:3000/api/articles`
5. Click Send

### Using Browser

For GET requests, simply visit in your browser:
```
http://localhost:3000/api/articles
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
npm install
```

---

### Issue: "MongoDB connection error"

**Possible causes:**
1. MongoDB is not running
2. Wrong connection string

**Solution:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb-community@7.0

# Test connection
mongosh
```

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill that process
kill -9 [PID]

# Or change port in .env:
PORT=3001
```

---

### Issue: "Article with this URL already exists"

**This is normal!** The scraper prevents duplicate articles. Articles with the same URL won't be added twice.

---

### Issue: Server starts but curl fails

**Check:**
1. Server is actually running (don't close the terminal)
2. Using correct URL: `http://localhost:3000` (not https)
3. Firewall not blocking port 3000

---

## 💾 Database Management

### View Data in MongoDB

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use beyondchats_articles

# View all articles
db.articles.find().pretty()

# Count articles
db.articles.countDocuments()

# Delete all articles
db.articles.deleteMany({})

# Exit
exit
```

### Using MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Select database: `beyondchats_articles`
4. View/edit articles visually

---

## 🔐 Security Notes

**For Production:**
- ✅ Use environment variables for sensitive data
- ✅ Add authentication to API endpoints
- ✅ Use MongoDB Atlas with IP whitelist
- ✅ Add rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS

**Current setup is for development only!**

---

## 📚 Technologies Used

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| Node.js | Runtime | [nodejs.org](https://nodejs.org/) |
| Express | Web framework | [expressjs.com](https://expressjs.com/) |
| MongoDB | Database | [mongodb.com](https://www.mongodb.com/) |
| Mongoose | MongoDB ODM | [mongoosejs.com](https://mongoosejs.com/) |
| Axios | HTTP client | [axios-http.com](https://axios-http.com/) |
| Cheerio | HTML parser | [cheerio.js.org](https://cheerio.js.org/) |

---

## 🎓 Learning Resources

- **Node.js Tutorial**: https://nodejs.dev/learn
- **Express Guide**: https://expressjs.com/en/guide/routing.html
- **MongoDB University**: https://university.mongodb.com/ (Free courses)
- **Mongoose Docs**: https://mongoosejs.com/docs/guide.html

---

## 📝 License

This project is for educational purposes.

---

## 🤝 Support

If you encounter issues:
1. Check Troubleshooting section above
2. Verify MongoDB is running
3. Check all files are created correctly
4. Review server logs for error messages

---

## 🎯 Quick Start Checklist

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Project files created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Server starts successfully
- [ ] Can access `http://localhost:3000`
- [ ] Scraping works (`POST /api/scrape`)

---

=
