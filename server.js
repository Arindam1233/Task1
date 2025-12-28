const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Article = require('./models/Article');
const scraper = require('./scraper');
console.log('scraper value:', scraper);
console.log('scraper type:', typeof scraper);
console.log('scraper resolved path:', require.resolve('./scraper'));
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req , res, next)=>{
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
       next();
});
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats_articles';
mongoose.connect(MONGODB_URI).then(()=>console.log('connected')).catch(err=> console.error("eror" + err));
app.get('/', (req, res) => {
  res.json({
    message: '🎉 BeyondChats Article API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API information',
      'POST /api/scrape': 'Scrape and store articles',
      'GET /api/articles': 'Get all articles',
      'GET /api/articles/:id': 'Get single article',
      'GET /api/articles/search/:term': 'Search articles',
      'POST /api/articles': 'Create new article',
      'PUT /api/articles/:id': 'Update article',
      'DELETE /api/articles/:id': 'Delete article'
    }
  });
});
app.post('/api/scrape'  , async(req,res)=>{
    try{
        const scraperA = await scraper();
        const savA = [];
        for(const a of scraperA){
           try{
            const saved = await Article.create(a);
            savA.push(saved);
           }
           catch(err){
            throw err;
           }
        }
    }
    catch(err){
        throw err;
    }
})
app.get('/api/articles', async (req, res) => {
  try {
    // Find all articles, sort by creation date (newest first)
    const articles = await Article.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.get('/api/articles/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    
   
    const articles = await Article.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },    // i = case insensitive
        { author: { $regex: searchTerm, $options: 'i' } },
        { excerpt: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: articles.length,
      searchTerm,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.put('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Article deleted successfully',
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs at http://localhost:${PORT}/`);
  console.log(`${'='.repeat(50)}\n`);
});

