const axios = require('axios');
const cheerio = require('cheerio');

async function scraper() {
  try {
    console.log('Fetching the last page of BeyondChats blog...');
    
    const page15Response = await axios.get('https://beyondchats.com/blogs/page/15/');
    const page14Response = await axios.get('https://beyondchats.com/blogs/page/14/');
    
    const articles = [];

    const $14 = cheerio.load(page14Response.data);
    $14('article').each((i, elem) => {
      if (i < 4) {
        const article = extractArticleData($14, elem);
        if (article) articles.push(article);
      }
    });
    
    const $15 = cheerio.load(page15Response.data);
    $15('article').each((i, elem) => {
      const article = extractArticleData($15, elem);
      if (article) articles.push(article);
    });
    
    console.log(`Successfully scraped ${articles.length} articles`);
    return articles;
    
  } catch (error) {
    console.error('Error scraping articles:', error.message);
    throw error;
  }
}

function extractArticleData($, elem) {
  try {
    const $article = $(elem);
    
    const link = $article.find('h2 a').attr('href');
    if (!link) return null;
    
    const title = $article.find('h2 a').text().trim();
    const image = $article.find('img').attr('src') || '';
    const author = $article.find('.author a').text().trim() || 
                   $article.find('[class*="author"]').text().trim() ||
                   'Unknown';
    const date = $article.find('time').text().trim() || 
                 $article.find('[class*="date"]').text().trim() ||
                 '';
    
    const tags = [];
    $article.find('a[rel="tag"]').each((i, tag) => {
      tags.push($(tag).text().trim());
    });
    
    const excerpt = $article.find('p').first().text().trim() || '';
    
    return {
      title,
      url: link,
      image,
      author,
      date,
      tags,
      excerpt,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting article data:', error.message);
    return null;
  }
}

module.exports = scraper;
