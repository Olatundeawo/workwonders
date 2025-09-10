# Advanced News Website Crawler

An elaborate Python script that crawls news websites to find articles containing specific companies and keywords. The crawler uses multiple parsing strategies, supports multi-threading, and provides comprehensive reporting.

## 🚀 Features

- **Multi-threaded crawling** for fast processing
- **Multiple parsing strategies**: RSS feeds, sitemaps, and direct crawling
- **Advanced content extraction** using newspaper3k and BeautifulSoup
- **Flexible matching** for companies in content and metadata
- **Keyword analysis** for qualifying articles
- **Rate limiting** and retry logic for polite crawling
- **Comprehensive logging** and progress tracking
- **Multiple output formats** (JSON and CSV)
- **Configurable settings** via JSON config file

## 📋 Prerequisites

- Python 3.7 or higher
- Required packages (install via pip)

## 🛠️ Installation

1. Clone or download the project files
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## 📁 File Structure

```
├── news_crawler.py      # Main crawler script
├── requirements.txt     # Python dependencies
├── config.json         # Configuration settings
├── websites.txt        # List of news websites to crawl
├── companies.txt       # List of companies to search for
├── keywords.txt        # List of keywords to match
└── README.md          # This file
```

## ⚙️ Configuration

### Text Files

1. **websites.txt**: Add one URL per line. Lines starting with # are comments.
   ```
   https://www.reuters.com
   https://www.bbc.com/news
   https://techcrunch.com
   ```

2. **companies.txt**: Add one company name per line. Lines starting with # are comments.
   ```
   Apple
   Microsoft
   Tesla
   ```

3. **keywords.txt**: Add one keyword/phrase per line. Lines starting with # are comments.
   ```
   acquisition
   merger
   artificial intelligence
   ```

### Configuration File (config.json)

- `max_workers`: Number of parallel threads (default: 8)
- `request_delay`: Delay between requests in seconds (default: 1.5)
- `timeout`: Request timeout in seconds (default: 30)
- `max_retries`: Maximum retry attempts (default: 3)
- `max_articles_per_site`: Maximum articles to process per website (default: 100)
- `search_methods`: List of methods to use ["rss", "sitemap", "crawl"]
- `output_formats`: Output formats ["json", "csv"]
- `case_sensitive`: Whether matching is case sensitive (default: false)
- `log_level`: Logging level ("DEBUG", "INFO", "WARNING", "ERROR") (default: "INFO")
- `log_urls`: Log individual URLs as they're discovered (default: false)
- `log_url_details`: Log URLs with additional metadata (default: false)

## 🏃‍♂️ Usage

### Basic Usage
```bash
python news_crawler.py
```

### How It Works

1. **Discovery Phase**: The crawler visits each website and discovers article URLs using:
   - RSS feed parsing
   - Sitemap analysis  
   - Homepage link crawling

2. **Content Extraction**: For each article URL:
   - Downloads and parses content using newspaper3k
   - Falls back to BeautifulSoup if needed
   - Extracts title, content, metadata, and publication date

3. **Analysis Phase**: 
   - Searches for company names in article content and metadata
   - If companies are found, searches for keywords in the content
   - Only articles matching both criteria are saved

4. **Results**: Saves matching articles to:
   - `news_results_YYYYMMDD_HHMMSS.json`
   - `news_results_YYYYMMDD_HHMMSS.csv`

## 📊 Output Format

### JSON Output
```json
{
  "url": "https://example.com/article",
  "title": "Company X Announces Major Partnership",
  "content": "Article content...",
  "found_companies": ["Company X", "Partner Corp"],
  "found_keywords": ["partnership", "acquisition"],
  "article_date": "2024-01-15",
  "crawl_timestamp": "2024-01-15T10:30:00"
}
```

### CSV Output
```csv
URL,Title,Companies,Keywords,Date,Timestamp,Error
https://example.com/article,Company X Partnership,Company X; Partner Corp,partnership; merger,2024-01-15,2024-01-15T10:30:00,
```

## 🔧 Advanced Usage

### Custom Configuration
Create a custom config file and specify it:
```python
crawler = NewsWebsiteCrawler('my_config.json')
```

### URL Logging
Enable detailed URL logging to see which URLs are discovered:

#### Quick Setup
```bash
python enable_url_logging.py
```

#### Manual Configuration
Edit `config.json`:
```json
{
  "log_level": "DEBUG",
  "log_urls": true,
  "log_url_details": true
}
```

**Logging Levels:**
- `log_urls: true` - Shows URLs as they're found
- `log_url_details: true` - Shows URLs with titles/metadata  
- `log_level: "DEBUG"` - Shows all crawler internals

**Sample Output:**
```
DEBUG - RSS URL: https://example.com/article1 | Title: Breaking News | Date: 2024-01-15
DEBUG - Processing article: https://example.com/article1
DEBUG - MATCH: https://example.com/article1 | Companies: Apple | Keywords: acquisition
```

### Programmatic Usage
```python
from news_crawler import NewsWebsiteCrawler

crawler = NewsWebsiteCrawler()
crawler.run()

# Access results
for result in crawler.results:
    print(f"Found: {result.title}")
    print(f"Companies: {result.found_companies}")
    print(f"Keywords: {result.found_keywords}")
```

## 📈 Performance Tips

1. **Adjust max_workers**: Increase for faster crawling, decrease if getting blocked
2. **Set request_delay**: Higher values are more polite but slower
3. **Limit max_articles_per_site**: Reduce for faster initial testing
4. **Use specific websites**: Target high-quality news sources for better results

## 🛡️ Ethical Considerations

- The crawler respects robots.txt when possible
- Includes rate limiting to avoid overwhelming servers
- Uses a proper User-Agent string
- Implements retry logic with backoff

## 🐛 Troubleshooting

### Common Issues

1. **Empty results**: Check if websites.txt, companies.txt, and keywords.txt exist and have content
2. **Network errors**: Increase timeout and retry values in config
3. **Slow performance**: Reduce max_workers or increase request_delay
4. **Blocked requests**: Use a different User-Agent or increase delays

### Logging
Check `news_crawler.log` for detailed execution logs and error messages.

## 📄 License

This project is provided as-is for educational and research purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
