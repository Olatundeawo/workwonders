#!/usr/bin/env python3
"""
Simple launcher script for the news crawler
Provides an interactive interface and setup checks
"""

import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    # Map package names to their import names
    required_packages = {
        'requests': 'requests',
        'beautifulsoup4': 'bs4', 
        'lxml': 'lxml',
        'feedparser': 'feedparser'
    }
    
    # Optional packages (crawler will work without these)
    optional_packages = {
        'newspaper3k': 'newspaper'
    }
    
    missing = []
    for package_name, import_name in required_packages.items():
        try:
            __import__(import_name)
        except ImportError:
            missing.append(package_name)
    
    # Check optional packages and warn if missing
    optional_missing = []
    for package_name, import_name in optional_packages.items():
        try:
            __import__(import_name)
        except ImportError:
            optional_missing.append(package_name)
    
    if missing:
        print("❌ Missing required packages:")
        for pkg in missing:
            print(f"  - {pkg}")
        print("\n💡 Install with: pip install -r requirements.txt")
        return False
    
    if optional_missing:
        print("⚠️  Optional packages missing (crawler will use fallback methods):")
        for pkg in optional_missing:
            print(f"  - {pkg}")
        print("\n💡 For better performance, install with: pip install -r requirements.txt")
    
    print("✅ All required packages are installed")
    return True

def check_files():
    """Check if required files exist"""
    required_files = {
        'input/websites.txt': 'List of news websites to crawl',
        'input/companies.txt': 'List of companies to search for', 
        'input/keywords.txt': 'List of keywords to match'
    }
    
    missing = []
    for filename, description in required_files.items():
        if not os.path.exists(filename):
            missing.append((filename, description))
    
    if missing:
        print("❌ Missing required files:")
        for filename, desc in missing:
            print(f"  - {filename}: {desc}")
        print("\n💡 Create these files with appropriate content before running")
        return False
    
    print("✅ All required files found")
    return True

def show_file_stats():
    """Show statistics about the input files"""
    files = ['input/websites.txt', 'input/companies.txt', 'input/keywords.txt']
    
    print("\n📊 File Statistics:")
    for filepath in files:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = [line.strip() for line in f if line.strip() and not line.startswith('#')]
                filename = os.path.basename(filepath)  # Show just filename in output
                print(f"  {filename}: {len(lines)} entries")

def main():
    """Main launcher function"""
    print("🕷️  Advanced News Website Crawler")
    print("=" * 50)
    
    print("\n🔍 Checking setup...")
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Setup incomplete. Please install missing packages.")
        return 1
    
    # Check files
    if not check_files():
        print("\n❌ Setup incomplete. Please create missing files.")
        return 1
    
    # Show file statistics
    show_file_stats()
    
    print("\n🚀 Ready to start crawling!")
    
    # Interactive mode
    while True:
        print("\nOptions:")
        print("1. Start crawling")
        print("2. Edit configuration")
        print("3. Configure URL logging")
        print("4. View file contents")
        print("5. Exit")
        
        try:
            choice = input("\nSelect option (1-5): ").strip()
            
            if choice == '1':
                print("\n🏃‍♂️ Starting crawler...")
                try:
                    from news_crawler import main as crawler_main
                    crawler_main()
                except KeyboardInterrupt:
                    print("\n⏹️  Crawling interrupted by user")
                except Exception as e:
                    print(f"\n❌ Error during crawling: {e}")
                
                input("\nPress Enter to continue...")
                
            elif choice == '2':
                config_file = 'config.json'
                if os.path.exists(config_file):
                    print(f"\n📝 Current config: {config_file}")
                    if os.name == 'nt':  # Windows
                        os.system(f'notepad {config_file}')
                    else:  # Unix/Linux/Mac
                        os.system(f'nano {config_file} || vi {config_file}')
                else:
                    print(f"\n❌ Config file {config_file} not found")
                
            elif choice == '3':
                print("\n🔧 Configuring URL logging...")
                try:
                    import subprocess
                    result = subprocess.run([sys.executable, 'enable_url_logging.py'], 
                                          capture_output=False)
                except Exception as e:
                    print(f"❌ Error running URL logging config: {e}")
                
                input("\nPress Enter to continue...")
                
            elif choice == '4':
                files_to_show = [
                    ('input/websites.txt', 'websites.txt'),
                    ('input/companies.txt', 'companies.txt'),
                    ('input/keywords.txt', 'keywords.txt')
                ]
                print("\nWhich file would you like to view?")
                for i, (filepath, display_name) in enumerate(files_to_show, 1):
                    print(f"{i}. {display_name}")
                
                try:
                    file_choice = int(input("Select file (1-3): ")) - 1
                    if 0 <= file_choice < len(files_to_show):
                        filepath, display_name = files_to_show[file_choice]
                        if os.path.exists(filepath):
                            print(f"\n📄 Contents of {display_name}:")
                            print("-" * 30)
                            with open(filepath, 'r', encoding='utf-8') as f:
                                content = f.read()
                                print(content[:1000])  # Show first 1000 chars
                                if len(content) > 1000:
                                    print("... (truncated)")
                        else:
                            print(f"❌ File {display_name} not found")
                except (ValueError, IndexError):
                    print("❌ Invalid selection")
                
                input("\nPress Enter to continue...")
                
            elif choice == '5':
                print("\n👋 Goodbye!")
                break
                
            else:
                print("❌ Invalid choice. Please select 1-5.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except EOFError:
            print("\n\n👋 Goodbye!")
            break
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
