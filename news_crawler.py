#!/usr/bin/env python3
"""
Advanced News Website Crawler
Crawls news websites to find articles containing specific companies and keywords.

Features:
- Multi-threaded crawling
- Multiple parsing strategies
- Rate limiting and retry logic
- Comprehensive logging
- Results export (JSON/CSV)
- Progress tracking
- Error handling
"""

import os
import re
import json
import csv
import time
import logging
import requests
import threading
import sys
import hashlib
from datetime import datetime
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse, urlencode
from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional, Tuple

import feedparser
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
try:
    from urllib3.util.retry import Retry
except ImportError:
    from requests.packages.urllib3.util.retry import Retry


class FlushingHandler(logging.StreamHandler):
    """Custom handler that forces immediate flushing for real-time logging"""
    def emit(self, record):
        super().emit(record)
        self.flush()
        sys.stdout.flush()
        sys.stderr.flush()


class UnicodeSafeFormatter:
    """Helper class to handle Unicode characters safely across different systems"""
    
    def __init__(self):
        # Check if we're on Windows and if the console supports Unicode
        self.use_unicode = self._check_unicode_support()
        
        # Define fallback characters for Windows/unsupported systems
        self.symbols = {
            'rocket': '🚀' if self.use_unicode else '[START]',
            'chart': '📊' if self.use_unicode else '[STATS]',
            'magnifying_glass': '🔍' if self.use_unicode else '[SEARCH]',
            'globe': '🌐' if self.use_unicode else '[WEB]',
            'satellite': '📡' if self.use_unicode else '[RSS]',
            'map': '🗺️' if self.use_unicode else '[SITEMAP]',
            'spider': '🕷️' if self.use_unicode else '[CRAWL]',
            'target': '🎯' if self.use_unicode else '[MATCH]',
            'checkmark': '✅' if self.use_unicode else '[OK]',
            'warning': '⚠️' if self.use_unicode else '[WARN]',
            'error': '❌' if self.use_unicode else '[ERROR]',
            'clock': '⏱️' if self.use_unicode else '[TIME]',
            'newspaper': '📰' if self.use_unicode else '[NEWS]',
            'building': '🏢' if self.use_unicode else '[COMPANY]',
            'key': '🔑' if self.use_unicode else '[KEYWORD]',
            'disk': '💾' if self.use_unicode else '[SAVE]',
            'folder': '📁' if self.use_unicode else '[FOLDER]',
            'party': '🎉' if self.use_unicode else '[DONE]',
            'bullet': '•' if self.use_unicode else '-',
            'dash': '─' if self.use_unicode else '-',
            'equals': '=' if self.use_unicode else '='
        }
    
    def _check_unicode_support(self):
        """Check if the current system supports Unicode emojis"""
        # For Windows systems, always use text alternatives to avoid encoding issues
        if sys.platform.startswith('win'):
            return False
        
        try:
            # On non-Windows systems, try to encode a test emoji
            test_emoji = '🚀'
            test_emoji.encode(sys.stdout.encoding or 'utf-8')
            return True
        except (UnicodeEncodeError, UnicodeError, Exception):
            return False
    
    def get(self, symbol_name):
        """Get a symbol, with fallback for unsupported systems"""
        return self.symbols.get(symbol_name, '')
    
    def clean_unicode_for_logging(self, text):
        """Clean Unicode characters that might cause encoding issues in logging"""
        if not text:
            return text
        try:
            # Try to encode as ASCII to check if it's safe
            text.encode('ascii')
            return text
        except UnicodeEncodeError:
            # Replace problematic Unicode characters with ASCII equivalents
            return text.encode('ascii', 'replace').decode('ascii')


class OnlineCompanyAliasService:
    """Service to fetch company aliases and related information from online APIs"""
    
    def __init__(self, cache_file: str = "output/company_aliases_cache.json", config: Dict = None):
        self.cache_file = cache_file
        self.cache = self.load_cache()
        self.config = config or {}
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NewsBot/1.0 (+https://example.com/bot)'
        })
    
    def load_cache(self) -> Dict:
        """Load cached company aliases"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}
    
    def save_cache(self):
        """Save company aliases to cache"""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(self.cache, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Warning: Could not save cache: {e}")
    
    def get_cache_key(self, company_name: str) -> str:
        """Generate cache key for company name"""
        return hashlib.md5(company_name.lower().encode()).hexdigest()
    
    def fetch_alpha_vantage_aliases(self, company_name: str) -> List[str]:
        """Fetch company information from Alpha Vantage (free tier)"""
        aliases = []
        try:
            # Clean company name for search
            search_name = company_name.replace('(', '').replace(')', '').strip()
            
            # Get API key from config
            api_key = self.config.get('alphavantage_api_key', 'demo')
            
            # Alpha Vantage Symbol Search API
            url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={urlencode({'keywords': search_name})}&apikey={api_key}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'bestMatches' in data:
                    for match in data['bestMatches'][:5]:  # Limit to top 5 matches
                        if '2. name' in match:
                            aliases.append(match['2. name'].lower())
                        if '1. symbol' in match:
                            aliases.append(match['1. symbol'].lower())
        except Exception as e:
            print(f"Alpha Vantage API error for {company_name}: {e}")
        
        return aliases
    
    def fetch_financial_modeling_aliases(self, company_name: str) -> List[str]:
        """Fetch company information from Financial Modeling Prep (free tier)"""
        aliases = []
        try:
            # Clean company name for search
            search_name = company_name.replace('(', '').replace(')', '').strip()
            
            # Financial Modeling Prep Company Search (free tier)
            url = f"https://financialmodelingprep.com/api/v3/search?query={urlencode({'query': search_name})}&limit=5&apikey=demo"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    for company in data[:5]:  # Limit to top 5 matches
                        if 'name' in company:
                            aliases.append(company['name'].lower())
                        if 'symbol' in company:
                            aliases.append(company['symbol'].lower())
        except Exception as e:
            print(f"Financial Modeling Prep API error for {company_name}: {e}")
        
        return aliases
    
    def fetch_clearbit_domain(self, company_name: str) -> List[str]:
        """Fetch company domain from Clearbit (free tier)"""
        aliases = []
        try:
            # Clean company name
            search_name = company_name.replace('(', '').replace(')', '').strip()
            
            # Clearbit Name to Domain API (free tier)
            url = f"https://company.clearbit.com/v1/domains/find?name={urlencode({'name': search_name})}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'domain' in data:
                    domain = data['domain']
                    aliases.append(domain.lower())
                    # Extract company name from domain
                    domain_parts = domain.split('.')
                    if len(domain_parts) > 1:
                        company_part = domain_parts[0]
                        aliases.append(company_part.lower())
        except Exception as e:
            print(f"Clearbit API error for {company_name}: {e}")
        
        return aliases
    
    def fetch_wikipedia_aliases(self, company_name: str) -> List[str]:
        """Fetch company aliases from Wikipedia"""
        aliases = []
        try:
            # Clean company name
            search_name = company_name.replace('(', '').replace(')', '').strip()
            
            # Wikipedia API search
            search_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urlencode({'title': search_name})}"
            
            response = self.session.get(search_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'title' in data:
                    aliases.append(data['title'].lower())
                if 'extract' in data:
                    # Extract potential aliases from the summary
                    extract = data['extract']
                    # Look for common patterns like "also known as", "formerly", etc.
                    patterns = [
                        r'also known as ([^.]*)',
                        r'formerly ([^.]*)',
                        r'commonly called ([^.]*)',
                        r'branded as ([^.]*)'
                    ]
                    for pattern in patterns:
                        matches = re.findall(pattern, extract, re.IGNORECASE)
                        for match in matches:
                            aliases.extend([m.strip().lower() for m in match.split(',')])
        except Exception as e:
            print(f"Wikipedia API error for {company_name}: {e}")
        
        return aliases
    
    def get_enhanced_local_aliases(self, company_name: str) -> List[str]:
        """Enhanced local alias generation with more comprehensive patterns"""
        aliases = set()
        company_lower = company_name.lower()
        
        # Add original name
        aliases.add(company_lower)
        
        # Extract from parentheses
        if '(' in company_name and ')' in company_name:
            main_name = company_name.split('(')[0].strip().lower()
            parenthetical = company_name.split('(')[1].split(')')[0].strip().lower()
            aliases.add(main_name)
            aliases.add(parenthetical)
            
            # Split parenthetical if it contains multiple words
            if ' ' in parenthetical:
                aliases.update(parenthetical.split())
        
        # Add common corporate suffixes and variations
        base_name = company_lower.replace(' inc', '').replace(' corp', '').replace(' ltd', '').replace(' llc', '')
        aliases.add(base_name)
        
        # Add common variations
        variations = [
            f"{base_name} inc",
            f"{base_name} corp", 
            f"{base_name} corporation",
            f"{base_name} ltd",
            f"{base_name} limited",
            f"{base_name} llc",
            f"{base_name} company",
            f"{base_name} co"
        ]
        aliases.update(variations)
        
        # Add domain variations
        if ' ' not in base_name:  # Only for single-word names
            aliases.add(f"{base_name}.com")
            aliases.add(f"{base_name}.org")
        
        # Company-specific enhancements
        if 'google' in company_lower or 'alphabet' in company_lower:
            aliases.update(['google', 'alphabet', 'google.com', 'goog', 'googl'])
        elif 'microsoft' in company_lower:
            aliases.update(['microsoft', 'msft', 'ms', 'microsoft.com'])
        elif 'apple' in company_lower:
            aliases.update(['apple', 'aapl', 'apple.com'])
        elif 'amazon' in company_lower:
            aliases.update(['amazon', 'amzn', 'amazon.com'])
        elif 'meta' in company_lower or 'facebook' in company_lower:
            aliases.update(['meta', 'facebook', 'fb', 'facebook.com', 'meta.com'])
        elif 'nvidia' in company_lower:
            aliases.update(['nvidia', 'nvda', 'nvidia.com'])
        elif 'tesla' in company_lower:
            aliases.update(['tesla', 'tsla', 'tesla.com'])
        elif 'netflix' in company_lower:
            aliases.update(['netflix', 'nflx', 'netflix.com'])
        elif 'samsung' in company_lower:
            aliases.update(['samsung', 'samsung.com'])
        elif 'ibm' in company_lower:
            aliases.update(['ibm', 'international business machines', 'ibm.com'])
        elif 'oracle' in company_lower:
            aliases.update(['oracle', 'orcl', 'oracle.com'])
        elif 'cisco' in company_lower:
            aliases.update(['cisco', 'csco', 'cisco.com'])
        elif 'amd' in company_lower:
            aliases.update(['amd', 'advanced micro devices', 'amd.com'])
        elif 'salesforce' in company_lower:
            aliases.update(['salesforce', 'crm', 'salesforce.com'])
        elif 'uber' in company_lower:
            aliases.update(['uber', 'uber.com'])
        elif 'spotify' in company_lower:
            aliases.update(['spotify', 'spot', 'spotify.com'])
        elif 'adobe' in company_lower:
            aliases.update(['adobe', 'adbe', 'adobe.com'])
        elif 'sony' in company_lower:
            aliases.update(['sony', 'sony.com'])
        elif 'qualcomm' in company_lower:
            aliases.update(['qualcomm', 'qcom', 'qualcomm.com'])
        
        return list(aliases)
    
    def get_company_aliases(self, company_name: str, use_cache: bool = True) -> List[str]:
        """Get company aliases from multiple online sources"""
        cache_key = self.get_cache_key(company_name)
        
        # Check cache first
        if use_cache and cache_key in self.cache:
            return self.cache[cache_key]
        
        aliases = set()
        
        # Try online sources first
        online_success = False
        try:
            # Alpha Vantage (financial data)
            alpha_aliases = self.fetch_alpha_vantage_aliases(company_name)
            if alpha_aliases:
                aliases.update(alpha_aliases)
                online_success = True
            
            # Financial Modeling Prep
            fmp_aliases = self.fetch_financial_modeling_aliases(company_name)
            if fmp_aliases:
                aliases.update(fmp_aliases)
                online_success = True
            
            # Clearbit domain
            clearbit_aliases = self.fetch_clearbit_domain(company_name)
            if clearbit_aliases:
                aliases.update(clearbit_aliases)
                online_success = True
            
            # Wikipedia
            wiki_aliases = self.fetch_wikipedia_aliases(company_name)
            if wiki_aliases:
                aliases.update(wiki_aliases)
                online_success = True
                
        except Exception as e:
            print(f"Online API error for {company_name}: {e}")
        
        # If online sources didn't provide good results, use enhanced local parsing
        if not online_success or len(aliases) < 3:
            enhanced_local = self.get_enhanced_local_aliases(company_name)
            aliases.update(enhanced_local)
        
        # Add original company name
        aliases.add(company_name.lower())
        
        # Clean and deduplicate
        clean_aliases = []
        for alias in aliases:
            if alias and len(alias.strip()) > 1:
                clean_alias = alias.strip().lower()
                if clean_alias not in clean_aliases:
                    clean_aliases.append(clean_alias)
        
        # Cache the results
        self.cache[cache_key] = clean_aliases
        self.save_cache()
        
        return clean_aliases

# Optional imports
try:
    from newspaper import Article
    HAS_NEWSPAPER = True
except ImportError:
    HAS_NEWSPAPER = False


@dataclass
class CrawlResult:
    """Data class to store crawl results"""
    url: str
    title: str = ""
    content: str = ""
    metadata: Dict = field(default_factory=dict)
    found_companies: Set[str] = field(default_factory=set)
    found_keywords: Set[str] = field(default_factory=set)
    article_date: Optional[str] = None
    crawl_timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    error: Optional[str] = None


class NewsWebsiteCrawler:
    """Advanced news website crawler with multiple parsing strategies"""
    
    def __init__(self, config_file: str = None):
        self.config = self.load_config(config_file)
        self.symbols = UnicodeSafeFormatter()  # Initialize Unicode-safe formatter
        self.setup_logging()
        self.session = self.create_session()
        
        # Log which symbol mode is being used
        mode = "Unicode emojis" if self.symbols.use_unicode else "Text alternatives"
        self.logger.info(f"Using {mode} for logging symbols")
        
        # Load data files
        self.websites = self.load_text_file('input/websites.txt')
        self.companies_raw = self.load_text_file('input/companies.txt')
        self.keywords = self.load_text_file('input/keywords.txt')
        
        # Initialize online company alias service
        self.online_alias_service = OnlineCompanyAliasService(config=self.config)
        
        # Parse companies to extract aliases and variations
        self.companies = []
        self.company_aliases = {}  # Maps original company name to list of aliases
        
        # Check if we should use online services
        use_online = self.config.get('use_online_company_aliases', True)
        
        if use_online:
            self.log_and_flush('info', f"Using online services to fetch company aliases...")
            for company_entry in self.companies_raw:
                try:
                    # Try online service first
                    online_aliases = self.online_alias_service.get_company_aliases(company_entry)
                    if len(online_aliases) > 1:  # If we got more than just the original name
                        self.company_aliases[company_entry] = online_aliases
                        self.companies.extend(online_aliases)
                        self.log_and_flush('info', f"Online aliases for {company_entry}: {len(online_aliases)} terms")
                    else:
                        # Fallback to enhanced local parsing
                        local_aliases = self.online_alias_service.get_enhanced_local_aliases(company_entry)
                        self.company_aliases[company_entry] = local_aliases
                        self.companies.extend(local_aliases)
                        self.log_and_flush('info', f"Enhanced local aliases for {company_entry}: {len(local_aliases)} terms")
                except Exception as e:
                    # Fallback to enhanced local parsing on error
                    local_aliases = self.online_alias_service.get_enhanced_local_aliases(company_entry)
                    self.company_aliases[company_entry] = local_aliases
                    self.companies.extend(local_aliases)
                    self.log_and_flush('info', f"Fallback enhanced local aliases for {company_entry}: {len(local_aliases)} terms")
        else:
            # Use only enhanced local parsing
            self.log_and_flush('info', f"Using enhanced local parsing for company aliases...")
            for company_entry in self.companies_raw:
                aliases = self.online_alias_service.get_enhanced_local_aliases(company_entry)
                self.company_aliases[company_entry] = aliases
                self.companies.extend(aliases)
        
        # Remove duplicates while preserving order
        seen = set()
        self.companies = [x for x in self.companies if not (x in seen or seen.add(x))]
        
        self.log_and_flush('info', f"Parsed {len(self.companies_raw)} company entries into {len(self.companies)} search terms")
        
        # Results storage
        self.results: List[CrawlResult] = []
        self.processed_urls: Set[str] = set()
        self.lock = threading.Lock()
        
        # Statistics
        self.stats = {
            'total_urls_processed': 0,
            'articles_with_companies': 0,
            'articles_with_keywords': 0,
            'articles_with_both': 0,
            'errors': 0,
            'start_time': time.time()
        }
        
        self.logger.info(f"Initialized crawler with {len(self.websites)} websites, "
                        f"{len(self.companies)} companies, {len(self.keywords)} keywords")

    def setup_logging(self):
        """Setup comprehensive logging with real-time output"""
        # Set log level from config
        log_level = getattr(logging, self.config.get('log_level', 'INFO').upper())
        
        # Clear any existing handlers
        logging.getLogger().handlers.clear()
        
        # Create formatters
        detailed_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        simple_formatter = logging.Formatter('%(levelname)s: %(message)s')
        
        # File handler (all messages) - force immediate flush
        file_handler = logging.FileHandler('output/news_crawler.log')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        
        # Console handler (respects config level) - use custom flushing handler
        console_handler = FlushingHandler()
        console_handler.setLevel(log_level)
        
        # Use simple format for DEBUG URL messages, detailed for others
        if log_level == logging.DEBUG:
            console_handler.setFormatter(simple_formatter)
        else:
            console_handler.setFormatter(detailed_formatter)
        
        # Configure root logger
        logging.basicConfig(
            level=logging.DEBUG,
            handlers=[file_handler, console_handler],
            force=True  # Force reconfiguration
        )
        
        self.logger = logging.getLogger(__name__)
        
        # Force immediate flushing for real-time logging
        import sys
        sys.stdout.flush()
        sys.stderr.flush()
    
    def log_and_flush(self, level: str, message: str):
        """Log message and immediately flush to ensure real-time output"""
        getattr(self.logger, level)(message)
        import sys
        sys.stdout.flush()
        sys.stderr.flush()
    
    def log_periodic_summary(self, processed_count: int, total_count: int):
        """Log a periodic summary of the crawling progress"""
        if processed_count % 25 == 0 and processed_count > 0:  # Every 25 articles
            elapsed = time.time() - self.stats['start_time']
            rate = processed_count / elapsed if elapsed > 0 else 0
            remaining = total_count - processed_count
            eta = remaining / rate if rate > 0 else 0
            
            self.log_and_flush('info', f"{self.symbols.get('chart')} Periodic Summary (Every 25 articles):")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Progress: {processed_count}/{total_count} articles processed")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Rate: {rate:.1f} articles/sec")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} ETA: {eta/60:.1f} minutes remaining")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Company matches found: {self.stats['articles_with_companies']}")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Keyword matches found: {self.stats['articles_with_keywords']}")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Total matches saved: {len(self.results)}")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Processing errors: {self.stats['errors']}")
            self.log_and_flush('info', self.symbols.get('dash') * 60)

    def load_config(self, config_file: str) -> Dict:
        """Load configuration from file or use defaults"""
        default_config = {
            'max_workers': 10,
            'request_delay': 1.0,
            'timeout': 30,
            'max_retries': 3,
            'user_agent': 'NewsBot/1.0 (+https://example.com/bot)',
            'max_articles_per_site': 50,
            'content_min_length': 100,
            'search_methods': ['rss', 'sitemap', 'crawl'],
            'output_formats': ['json', 'csv'],
            'case_sensitive': False,
            'log_level': 'INFO',
            'log_urls': False,
            'log_url_details': False,
            'use_online_company_aliases': True,
            'alphavantage_api_key': 'demo'
        }
        
        # If no config file specified, try to load config.json from current directory
        if not config_file:
            config_file = 'config.json'
        
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
                print(f"[OK] Loaded configuration from {config_file}")
            except Exception as e:
                print(f"[WARN] Failed to load config from {config_file}: {e}, using defaults")
        else:
            if config_file != 'config.json':  # Only warn if user specified a file
                print(f"[WARN] Config file {config_file} not found, using defaults")
        
        return default_config

    def create_session(self) -> requests.Session:
        """Create configured requests session with retry strategy"""
        session = requests.Session()
        
        # Retry strategy
        retry_strategy = Retry(
            total=self.config['max_retries'],
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        session.headers.update({
            'User-Agent': self.config['user_agent']
        })
        
        return session

    def load_text_file(self, filename: str) -> List[str]:
        """Load and clean text file contents"""
        if not os.path.exists(filename):
            self.logger.warning(f"File {filename} not found, creating empty list")
            return []
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                items = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            self.logger.info(f"Loaded {len(items)} items from {filename}")
            return items
        except Exception as e:
            self.logger.error(f"Error loading {filename}: {e}")
            return []
    
    def parse_company_aliases(self, company_entry: str) -> List[str]:
        """Parse a company entry to extract main name and aliases"""
        aliases = []
        
        # Remove any trailing comments
        company_entry = company_entry.split('#')[0].strip()
        
        # Check for parenthetical aliases like "Alphabet (Google)"
        if '(' in company_entry and ')' in company_entry:
            # Extract main name and parenthetical content
            main_name = company_entry.split('(')[0].strip()
            parenthetical = company_entry.split('(')[1].split(')')[0].strip()
            
            # Add main name
            aliases.append(main_name)
            
            # Add parenthetical content
            aliases.append(parenthetical)
            
            # If parenthetical contains multiple words, add individual words
            if ' ' in parenthetical:
                aliases.extend(parenthetical.split())
        else:
            # No parenthetical, just add the main name
            aliases.append(company_entry)
        
        # Add common variations and aliases for well-known companies
        company_lower = company_entry.lower()
        
        # Google/Alphabet variations
        if 'google' in company_lower or 'alphabet' in company_lower:
            aliases.extend(['Google', 'Alphabet', 'Google.com', 'Google Inc', 'Alphabet Inc'])
        
        # Facebook/Meta variations
        if 'facebook' in company_lower or 'meta' in company_lower:
            aliases.extend(['Facebook', 'Meta', 'Facebook Inc', 'Meta Inc', 'FB'])
        
        # Microsoft variations
        if 'microsoft' in company_lower:
            aliases.extend(['Microsoft', 'Microsoft Corp', 'MSFT', 'MS'])
        
        # Apple variations
        if 'apple' in company_lower:
            aliases.extend(['Apple', 'Apple Inc', 'AAPL'])
        
        # Amazon variations
        if 'amazon' in company_lower:
            aliases.extend(['Amazon', 'Amazon.com', 'Amazon Inc', 'AMZN'])
        
        # NVIDIA variations
        if 'nvidia' in company_lower:
            aliases.extend(['NVIDIA', 'Nvidia', 'NVDA'])
        
        # Tesla variations
        if 'tesla' in company_lower:
            aliases.extend(['Tesla', 'Tesla Inc', 'TSLA'])
        
        # Netflix variations
        if 'netflix' in company_lower:
            aliases.extend(['Netflix', 'Netflix Inc', 'NFLX'])
        
        # Samsung variations
        if 'samsung' in company_lower:
            aliases.extend(['Samsung', 'Samsung Electronics', 'Samsung Inc'])
        
        # IBM variations
        if 'ibm' in company_lower:
            aliases.extend(['IBM', 'International Business Machines'])
        
        # Oracle variations
        if 'oracle' in company_lower:
            aliases.extend(['Oracle', 'Oracle Corp', 'Oracle Inc'])
        
        # Cisco variations
        if 'cisco' in company_lower:
            aliases.extend(['Cisco', 'Cisco Systems', 'CSCO'])
        
        # AMD variations
        if 'amd' in company_lower:
            aliases.extend(['AMD', 'Advanced Micro Devices'])
        
        # Salesforce variations
        if 'salesforce' in company_lower:
            aliases.extend(['Salesforce', 'Salesforce.com', 'CRM'])
        
        # Uber variations
        if 'uber' in company_lower:
            aliases.extend(['Uber', 'Uber Technologies', 'UBER'])
        
        # Spotify variations
        if 'spotify' in company_lower:
            aliases.extend(['Spotify', 'Spotify Technology', 'SPOT'])
        
        # Adobe variations
        if 'adobe' in company_lower:
            aliases.extend(['Adobe', 'Adobe Inc', 'ADBE'])
        
        # Sony variations
        if 'sony' in company_lower:
            aliases.extend(['Sony', 'Sony Corp', 'Sony Group'])
        
        # Qualcomm variations
        if 'qualcomm' in company_lower:
            aliases.extend(['Qualcomm', 'Qualcomm Inc', 'QCOM'])
        
        # Remove duplicates and empty strings, convert to lowercase for case-insensitive matching
        aliases = list(set([alias.strip().lower() for alias in aliases if alias.strip()]))
        
        return aliases

    def find_rss_feeds(self, website_url: str) -> List[str]:
        """Find RSS feeds for a website"""
        feeds = []
        try:
            response = self.session.get(website_url, timeout=self.config['timeout'])
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for RSS feed links
            for link in soup.find_all('link', type=re.compile('rss|atom')):
                if link.get('href'):
                    feed_url = urljoin(website_url, link['href'])
                    feeds.append(feed_url)
            
            # Common RSS paths
            common_paths = ['/rss', '/feed', '/rss.xml', '/feed.xml', '/atom.xml']
            for path in common_paths:
                potential_feed = urljoin(website_url, path)
                try:
                    feed_response = self.session.head(potential_feed, timeout=10)
                    if feed_response.status_code == 200:
                        feeds.append(potential_feed)
                except:
                    pass
                    
        except Exception as e:
            self.logger.error(f"Error finding RSS feeds for {website_url}: {e}")
        
        return list(set(feeds))  # Remove duplicates

    def parse_rss_feed(self, feed_url: str) -> List[str]:
        """Parse RSS feed and extract article URLs"""
        article_urls = []
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:self.config['max_articles_per_site']]:
                if hasattr(entry, 'link'):
                    article_urls.append(entry.link)
                    
                    # Log individual URLs if enabled
                    if self.config.get('log_urls', False):
                        self.logger.debug(f"RSS URL: {entry.link}")
                    
                    # Log detailed URL info if enabled
                    if self.config.get('log_url_details', False):
                        title = getattr(entry, 'title', 'No title')
                        published = getattr(entry, 'published', 'No date')
                        # Clean Unicode characters that might cause encoding issues
                        title = self.symbols.clean_unicode_for_logging(title)
                        published = self.symbols.clean_unicode_for_logging(published)
                        self.logger.debug(f"RSS URL: {entry.link} | Title: {title} | Date: {published}")
                        
        except Exception as e:
            self.logger.error(f"Error parsing RSS feed {feed_url}: {e}")
        
        return article_urls

    def find_sitemap_urls(self, website_url: str) -> List[str]:
        """Find and parse sitemap URLs"""
        article_urls = []
        sitemap_urls = [
            urljoin(website_url, '/sitemap.xml'),
            urljoin(website_url, '/sitemap_index.xml'),
            urljoin(website_url, '/news-sitemap.xml')
        ]
        
        for sitemap_url in sitemap_urls:
            try:
                response = self.session.get(sitemap_url, timeout=self.config['timeout'])
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'xml')
                    
                    # Parse sitemap URLs
                    for loc in soup.find_all('loc'):
                        url = loc.text.strip()
                        if any(keyword in url.lower() for keyword in ['news', 'article', 'post']):
                            article_urls.append(url)
                            
                            # Log individual URLs if enabled
                            if self.config.get('log_urls', False):
                                self.logger.debug(f"Sitemap URL: {url}")
                            
                            # Log detailed URL info if enabled  
                            if self.config.get('log_url_details', False):
                                # Clean Unicode characters that might cause encoding issues
                                clean_url = self.symbols.clean_unicode_for_logging(url)
                                clean_sitemap_url = self.symbols.clean_unicode_for_logging(sitemap_url)
                                self.logger.debug(f"Sitemap URL: {clean_url} | From: {clean_sitemap_url}")
                
                if len(article_urls) >= self.config['max_articles_per_site']:
                    break
                    
            except Exception as e:
                self.logger.debug(f"Sitemap not found or error: {sitemap_url} - {e}")
        
        return article_urls[:self.config['max_articles_per_site']]

    def crawl_website_links(self, website_url: str) -> List[str]:
        """Crawl website homepage for article links"""
        article_urls = []
        try:
            response = self.session.get(website_url, timeout=self.config['timeout'])
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for article links
            selectors = [
                'a[href*="article"]',
                'a[href*="news"]',
                'a[href*="post"]',
                'article a',
                '.article a',
                '.news a',
                '.post a'
            ]
            
            for selector in selectors:
                links = soup.select(selector)
                for link in links:
                    href = link.get('href')
                    if href:
                        full_url = urljoin(website_url, href)
                        if self.is_article_url(full_url):
                            article_urls.append(full_url)
                            
                            # Log individual URLs if enabled
                            if self.config.get('log_urls', False):
                                self.logger.debug(f"Crawl URL: {full_url}")
                            
                            # Log detailed URL info if enabled
                            if self.config.get('log_url_details', False):
                                link_text = link.get_text(strip=True)[:50] + "..." if len(link.get_text(strip=True)) > 50 else link.get_text(strip=True)
                                # Clean Unicode characters that might cause encoding issues
                                link_text = self.symbols.clean_unicode_for_logging(link_text)
                                self.logger.debug(f"Crawl URL: {full_url} | Link text: {link_text} | Selector: {selector}")
                
                if len(article_urls) >= self.config['max_articles_per_site']:
                    break
                    
        except Exception as e:
            self.logger.error(f"Error crawling {website_url}: {e}")
        
        return list(set(article_urls))[:self.config['max_articles_per_site']]

    def is_article_url(self, url: str) -> bool:
        """Check if URL looks like an article URL"""
        article_indicators = [
            'article', 'news', 'post', 'story', 'blog',
            r'\d{4}/\d{2}/\d{2}',  # Date pattern
            r'/\d+/',  # ID pattern
        ]
        
        url_lower = url.lower()
        return any(re.search(indicator, url_lower) for indicator in article_indicators)

    def extract_article_content(self, url: str) -> CrawlResult:
        """Extract article content using multiple methods"""
        result = CrawlResult(url=url)
        
        try:
            # Method 1: newspaper3k (if available)
            if HAS_NEWSPAPER:
                try:
                    article = Article(url)
                    article.download()
                    article.parse()
                    
                    result.title = article.title or ""
                    result.content = article.text or ""
                    result.article_date = str(article.publish_date) if article.publish_date else None
                    result.metadata = {
                        'authors': article.authors,
                        'keywords': article.keywords,
                        'summary': article.summary,
                        'meta_keywords': article.meta_keywords
                    }
                    
                    # If newspaper extraction successful, return
                    if result.title and len(result.content) > self.config['content_min_length']:
                        return result
                        
                except Exception as e:
                    self.logger.debug(f"Newspaper extraction failed for {url}: {e}")
            
            # Method 2: BeautifulSoup fallback
            response = self.session.get(url, timeout=self.config['timeout'])
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title_elem = soup.find('title') or soup.find('h1')
            result.title = title_elem.get_text(strip=True) if title_elem else ""
            
            # Extract content
            content_selectors = [
                'article', '.article-content', '.post-content', 
                '.entry-content', '.content', 'main', '.main-content'
            ]
            
            content_text = ""
            for selector in content_selectors:
                elem = soup.select_one(selector)
                if elem:
                    content_text = elem.get_text(separator=' ', strip=True)
                    if len(content_text) > self.config['content_min_length']:
                        break
            
            result.content = content_text
            
            # Extract metadata
            meta_tags = soup.find_all('meta')
            metadata = {}
            for tag in meta_tags:
                name = tag.get('name') or tag.get('property') or tag.get('itemprop')
                content = tag.get('content')
                if name and content:
                    metadata[name] = content
            
            result.metadata = metadata
                
        except Exception as e:
            result.error = str(e)
            self.logger.error(f"Error extracting content from {url}: {e}")
        
        return result

    def analyze_content(self, result: CrawlResult) -> CrawlResult:
        """Analyze content for companies and keywords with improved detection"""
        # Include URL in search text for better detection
        url_text = result.url.lower() if result.url else ""
        search_text = f"{result.title} {result.content} {url_text}".lower()
        meta_text = " ".join(str(v) for v in result.metadata.values()).lower()
        
        if not self.config['case_sensitive']:
            keywords = [k.lower() for k in self.keywords]
        else:
            keywords = self.keywords
        
        # Find companies using improved alias detection
        found_company_aliases = set()
        
        for company_alias in self.companies:
            company_alias_lower = company_alias.lower()
            if company_alias_lower in search_text or company_alias_lower in meta_text:
                found_company_aliases.add(company_alias)
        
        # Map found aliases back to original company names
        for original_company, aliases in self.company_aliases.items():
            # Check if any alias of this company was found
            if any(alias in found_company_aliases for alias in aliases):
                result.found_companies.add(original_company)
        
        # If companies found, check for keywords
        if result.found_companies:
            for keyword in keywords:
                keyword_lower = keyword.lower() if not self.config['case_sensitive'] else keyword
                if keyword_lower in search_text:
                    result.found_keywords.add(keyword)
        
        return result

    def process_article(self, url: str) -> Optional[CrawlResult]:
        """Process a single article URL"""
        with self.lock:
            if url in self.processed_urls:
                return None
            self.processed_urls.add(url)
            self.stats['total_urls_processed'] += 1
        
        try:
            time.sleep(self.config['request_delay'])
            
            result = self.extract_article_content(url)
            result = self.analyze_content(result)
            
            # Update statistics
            with self.lock:
                if result.found_companies:
                    self.stats['articles_with_companies'] += 1
                if result.found_keywords:
                    self.stats['articles_with_keywords'] += 1
                if result.found_companies and result.found_keywords:
                    self.stats['articles_with_both'] += 1
                if result.error:
                    self.stats['errors'] += 1
            
            # Log processing if URL logging enabled
            if self.config.get('log_urls', False):
                self.logger.debug(f"Processing article: {url}")
                
            # Only store results with companies found
            if result.found_companies:
                with self.lock:
                    self.results.append(result)
                
                # Create descriptive match message
                companies_str = ', '.join(result.found_companies)
                keywords_str = ', '.join(result.found_keywords) if result.found_keywords else "None"
                title_short = result.title[:60] + "..." if len(result.title) > 60 else result.title
                
                # Show which aliases were found for better transparency
                found_aliases_info = []
                for company in result.found_companies:
                    if company in self.company_aliases:
                        # Find which aliases were actually matched
                        search_text = f"{result.title} {result.content}".lower()
                        meta_text = " ".join(str(v) for v in result.metadata.values()).lower()
                        matched_aliases = [alias for alias in self.company_aliases[company] 
                                         if alias.lower() in search_text or alias.lower() in meta_text]
                        if matched_aliases:
                            found_aliases_info.append(f"{company} (via: {', '.join(matched_aliases[:3])})")
                        else:
                            found_aliases_info.append(company)
                    else:
                        found_aliases_info.append(company)
                
                self.log_and_flush('info', f"{self.symbols.get('target')} MATCH FOUND: '{title_short}'")
                self.log_and_flush('info', f"   {self.symbols.get('bullet')} Companies mentioned: {', '.join(found_aliases_info)}")
                self.log_and_flush('info', f"   {self.symbols.get('bullet')} Keywords found: {keywords_str}")
                self.log_and_flush('info', f"   {self.symbols.get('bullet')} URL: {url}")
                               
                # Log detailed match info if enabled
                if self.config.get('log_url_details', False):
                    self.logger.debug(f"DETAILED MATCH: {url} | Title: {result.title} | "
                                    f"Companies: {', '.join(result.found_companies)} | "
                                    f"Keywords: {', '.join(result.found_keywords)}")
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error processing article {url}: {e}")
            with self.lock:
                self.stats['errors'] += 1
            return None

    def crawl_website(self, website_url: str) -> List[str]:
        """Crawl a single website using multiple methods"""
        self.log_and_flush('info', f"{self.symbols.get('magnifying_glass')} Starting to crawl website: {website_url}")
        all_article_urls = []
        method_results = {}
        
        for method in self.config['search_methods']:
            try:
                if method == 'rss':
                    self.log_and_flush('info', f"{self.symbols.get('satellite')} Searching for RSS feeds on {website_url}")
                    feeds = self.find_rss_feeds(website_url)
                    if feeds:
                        self.log_and_flush('info', f"{self.symbols.get('satellite')} Found {len(feeds)} RSS feed(s) for {website_url}")
                        for feed in feeds:
                            urls = self.parse_rss_feed(feed)
                            all_article_urls.extend(urls)
                            method_results['rss'] = method_results.get('rss', 0) + len(urls)
                            self.log_and_flush('info', f"{self.symbols.get('satellite')} RSS feed '{feed}' contained {len(urls)} article URLs")
                    else:
                        self.log_and_flush('info', f"{self.symbols.get('satellite')} No RSS feeds found for {website_url}")
                
                elif method == 'sitemap':
                    self.log_and_flush('info', f"{self.symbols.get('map')} Searching for sitemaps on {website_url}")
                    urls = self.find_sitemap_urls(website_url)
                    all_article_urls.extend(urls)
                    method_results['sitemap'] = len(urls)
                    if urls:
                        self.log_and_flush('info', f"{self.symbols.get('map')} Found {len(urls)} article URLs from sitemaps for {website_url}")
                    else:
                        self.log_and_flush('info', f"{self.symbols.get('map')} No sitemap URLs found for {website_url}")
                
                elif method == 'crawl':
                    self.log_and_flush('info', f"{self.symbols.get('spider')} Crawling homepage links for {website_url}")
                    urls = self.crawl_website_links(website_url)
                    all_article_urls.extend(urls)
                    method_results['crawl'] = len(urls)
                    if urls:
                        self.log_and_flush('info', f"{self.symbols.get('spider')} Found {len(urls)} article URLs by crawling {website_url}")
                    else:
                        self.log_and_flush('info', f"{self.symbols.get('spider')} No article URLs found by crawling {website_url}")
                    
            except Exception as e:
                self.log_and_flush('error', f"{self.symbols.get('error')} Error in {method} method for {website_url}: {e}")
        
        # Remove duplicates and limit
        unique_urls = list(set(all_article_urls))[:self.config['max_articles_per_site']]
        
        # Create summary message
        method_summary = ", ".join([f"{method}: {count}" for method, count in method_results.items()])
        self.log_and_flush('info', f"{self.symbols.get('checkmark')} Completed crawling {website_url} - Found {len(unique_urls)} unique article URLs ({method_summary})")
        
        return unique_urls

    def run(self):
        """Main crawling execution"""
        self.log_and_flush('info', f"{self.symbols.get('rocket')} Starting news crawling process...")
        self.log_and_flush('info', f"{self.symbols.get('chart')} Configuration: {len(self.websites)} websites, {len(self.companies)} companies, {len(self.keywords)} keywords")
        
        # Collect all article URLs
        all_urls = []
        website_results = {}
        
        self.log_and_flush('info', f"{self.symbols.get('magnifying_glass')} Phase 1: Discovering article URLs from {len(self.websites)} websites...")
        
        for i, website in enumerate(self.websites, 1):
            try:
                self.log_and_flush('info', f"{self.symbols.get('globe')} Processing website {i}/{len(self.websites)}: {website}")
                urls = self.crawl_website(website)
                all_urls.extend(urls)
                website_results[website] = len(urls)
            except Exception as e:
                self.log_and_flush('error', f"{self.symbols.get('error')} Failed to crawl {website}: {e}")
                website_results[website] = 0
        
        # Summary of URL discovery
        total_urls_found = len(all_urls)
        websites_with_urls = sum(1 for count in website_results.values() if count > 0)
        
        self.log_and_flush('info', f"{self.symbols.get('chart')} URL Discovery Summary:")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Total article URLs discovered: {total_urls_found}")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Websites with articles found: {websites_with_urls}/{len(self.websites)}")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Average URLs per website: {total_urls_found/len(self.websites):.1f}")
        
        if total_urls_found == 0:
            self.log_and_flush('warning', f"{self.symbols.get('warning')} No article URLs found! Check your website list and network connection.")
            return
        
        self.log_and_flush('info', f"{self.symbols.get('magnifying_glass')} Phase 2: Analyzing {total_urls_found} articles for company and keyword matches...")
        
        # Process articles in parallel
        with ThreadPoolExecutor(max_workers=self.config['max_workers']) as executor:
            future_to_url = {executor.submit(self.process_article, url): url for url in all_urls}
            
            for i, future in enumerate(as_completed(future_to_url), 1):
                try:
                    future.result()
                    if i % 10 == 0:  # Progress update every 10 articles
                        self.print_progress(i, len(all_urls))
                    # Periodic summary every 25 articles
                    self.log_periodic_summary(i, len(all_urls))
                except Exception as e:
                    url = future_to_url[future]
                    self.log_and_flush('error', f"{self.symbols.get('error')} Exception processing {url}: {e}")
        
        self.print_final_stats()
        self.save_results()

    def print_progress(self, processed: int, total: int):
        """Print crawling progress with enhanced statistics"""
        percent = (processed / total) * 100
        elapsed = time.time() - self.stats['start_time']
        rate = processed / elapsed if elapsed > 0 else 0
        remaining = total - processed
        eta = remaining / rate if rate > 0 else 0
        
        self.log_and_flush('info', f"{self.symbols.get('chart')} Progress Update:")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Articles processed: {processed}/{total} ({percent:.1f}%)")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Processing rate: {rate:.1f} articles/sec")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Estimated time remaining: {eta/60:.1f} minutes")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Articles with company matches: {self.stats['articles_with_companies']}")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Articles with keyword matches: {self.stats['articles_with_keywords']}")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Articles with both matches: {self.stats['articles_with_both']}")
        self.log_and_flush('info', f"   {self.symbols.get('bullet')} Total matching articles found: {len(self.results)}")

    def print_final_stats(self):
        """Print final crawling statistics with enhanced formatting"""
        elapsed = time.time() - self.stats['start_time']
        
        self.log_and_flush('info', self.symbols.get('equals') * 80)
        self.log_and_flush('info', f"{self.symbols.get('party')} CRAWLING COMPLETED SUCCESSFULLY!")
        self.log_and_flush('info', self.symbols.get('equals') * 80)
        
        # Time statistics
        hours = int(elapsed // 3600)
        minutes = int((elapsed % 3600) // 60)
        seconds = int(elapsed % 60)
        time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}" if hours > 0 else f"{minutes:02d}:{seconds:02d}"
        
        self.log_and_flush('info', f"{self.symbols.get('clock')} Total execution time: {time_str}")
        self.log_and_flush('info', f"{self.symbols.get('chart')} Processing rate: {self.stats['total_urls_processed'] / elapsed:.1f} articles/sec")
        
        # Article processing statistics
        self.log_and_flush('info', f"{self.symbols.get('newspaper')} Articles processed: {self.stats['total_urls_processed']}")
        self.log_and_flush('info', f"{self.symbols.get('building')} Articles mentioning companies: {self.stats['articles_with_companies']}")
        self.log_and_flush('info', f"{self.symbols.get('key')} Articles containing keywords: {self.stats['articles_with_keywords']}")
        self.log_and_flush('info', f"{self.symbols.get('target')} Articles with both companies and keywords: {self.stats['articles_with_both']}")
        self.log_and_flush('info', f"{self.symbols.get('error')} Processing errors: {self.stats['errors']}")
        
        # Success rates
        if self.stats['total_urls_processed'] > 0:
            company_rate = (self.stats['articles_with_companies'] / self.stats['total_urls_processed']) * 100
            keyword_rate = (self.stats['articles_with_keywords'] / self.stats['total_urls_processed']) * 100
            both_rate = (self.stats['articles_with_both'] / self.stats['total_urls_processed']) * 100
            error_rate = (self.stats['errors'] / self.stats['total_urls_processed']) * 100
            
            self.log_and_flush('info', f"{self.symbols.get('chart')} Success rates:")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Company match rate: {company_rate:.1f}%")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Keyword match rate: {keyword_rate:.1f}%")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Both match rate: {both_rate:.1f}%")
            self.log_and_flush('info', f"   {self.symbols.get('bullet')} Error rate: {error_rate:.1f}%")
        
        self.log_and_flush('info', f"{self.symbols.get('disk')} Total matching articles saved: {len(self.results)}")
        self.log_and_flush('info', self.symbols.get('equals') * 80)

    def save_results(self):
        """Save results in multiple formats with enhanced logging"""
        if not self.results:
            self.log_and_flush('warning', f"{self.symbols.get('warning')} No results to save - no matching articles were found.")
            return
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_and_flush('info', f"{self.symbols.get('disk')} Saving {len(self.results)} matching articles to output files...")
        
        if 'json' in self.config['output_formats']:
            json_file = f"output/news_results_{timestamp}.json"
            with open(json_file, 'w', encoding='utf-8') as f:
                json_data = []
                for result in self.results:
                    data = {
                        'url': result.url,
                        'title': result.title,
                        'content': result.content[:500] + '...' if len(result.content) > 500 else result.content,
                        'found_companies': list(result.found_companies),
                        'found_keywords': list(result.found_keywords),
                        'article_date': result.article_date,
                        'crawl_timestamp': result.crawl_timestamp,
                        'error': result.error
                    }
                    json_data.append(data)
                
                json.dump(json_data, f, indent=2, ensure_ascii=False)
            
            self.log_and_flush('info', f"{self.symbols.get('checkmark')} JSON results saved to: {json_file}")
        
        if 'csv' in self.config['output_formats']:
            csv_file = f"output/news_results_{timestamp}.csv"
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['URL', 'Title', 'Companies', 'Keywords', 'Date', 'Timestamp', 'Error'])
                
                for result in self.results:
                    writer.writerow([
                        result.url,
                        result.title,
                        '; '.join(result.found_companies),
                        '; '.join(result.found_keywords),
                        result.article_date,
                        result.crawl_timestamp,
                        result.error or ''
                    ])
            
            self.log_and_flush('info', f"{self.symbols.get('checkmark')} CSV results saved to: {csv_file}")
        
        self.log_and_flush('info', f"{self.symbols.get('folder')} All results have been saved successfully!")


def main():
    """Main entry point"""
    print("Advanced News Website Crawler")
    print("=" * 40)
    
    # Check if required files exist
    required_files = ['input/websites.txt', 'input/companies.txt', 'input/keywords.txt']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"Warning: Missing files: {', '.join(missing_files)}")
        print("The crawler will continue but may not work properly without these files.")
        input("Press Enter to continue or Ctrl+C to exit...")
    
    try:
        crawler = NewsWebsiteCrawler()
        crawler.run()
        
        print(f"\nCrawling completed! Found {len(crawler.results)} matching articles.")
        print("Check the generated files for detailed results.")
        
    except KeyboardInterrupt:
        print("\nCrawling interrupted by user.")
    except Exception as e:
        print(f"Error during crawling: {e}")


if __name__ == "__main__":
    main()
