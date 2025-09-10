#!/usr/bin/env python3
"""Simple test script to verify detection logic fix"""

from news_crawler import CrawlResult

def test_detection_logic():
    """Test the detection logic with a simple example"""
    
    # Create a test result with URL containing company name
    result = CrawlResult(url='https://www.bloomberg.com/news/articles/2025-09-04/tesla-sales-slump-how-musk-is-betting-on-robotaxis-robots-as-evs-struggle')
    result.title = 'Tesla Sales Slump'
    result.content = 'Tesla is facing challenges with data breach concerns'
    
    # Test the search text construction (this is what the fixed analyze_content does)
    url_text = result.url.lower() if result.url else ""
    search_text = f"{result.title} {result.content} {url_text}".lower()
    
    print("=== DETECTION LOGIC TEST ===")
    print(f"URL: {result.url}")
    print(f"Title: {result.title}")
    print(f"Content: {result.content}")
    print(f"Search text: {search_text}")
    print()
    
    # Test company detection
    test_companies = ['tesla', 'microsoft', 'apple', 'google']
    found_companies = []
    for company in test_companies:
        if company in search_text:
            found_companies.append(company)
    
    print("=== COMPANY DETECTION ===")
    print(f"Found companies: {found_companies}")
    print()
    
    # Test keyword detection
    test_keywords = ['data breach', 'sales slump', 'cryptocurrency', 'ransomware']
    found_keywords = []
    for keyword in test_keywords:
        if keyword in search_text:
            found_keywords.append(keyword)
    
    print("=== KEYWORD DETECTION ===")
    print(f"Found keywords: {found_keywords}")
    print()
    
    # Test specific URL patterns from terminal
    test_urls = [
        'https://www.france24.com/en/live-news/20250904-france-detains-seven-over-new-cryptocurrency-kidnapping',
        'https://www.bloomberg.com/news/articles/2025-09-04/tesla-sales-slump-how-musk-is-betting-on-robotaxis-robots-as-evs-struggle',
        'https://www.france24.com/en/live-news/20250904-italian-fashion-designer-giorgio-armani-dies-aged-91'
    ]
    
    print("=== URL PATTERN TESTING ===")
    for url in test_urls:
        url_lower = url.lower()
        companies_in_url = [c for c in test_companies if c in url_lower]
        keywords_in_url = [k for k in test_keywords if k in url_lower]
        print(f"URL: {url}")
        print(f"  Companies in URL: {companies_in_url}")
        print(f"  Keywords in URL: {keywords_in_url}")
        print()

if __name__ == "__main__":
    test_detection_logic()
