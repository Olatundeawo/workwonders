#!/usr/bin/env python3
"""
Setup and installation script for the News Crawler
"""

import os
import subprocess
import sys

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ All packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def create_sample_files():
    """Create sample configuration files if they don't exist"""
    files_created = []
    
    # Create directories if they don't exist
    os.makedirs('input', exist_ok=True)
    os.makedirs('output', exist_ok=True)
    
    # Sample websites if file doesn't exist
    if not os.path.exists('input/websites.txt'):
        with open('input/websites.txt', 'w') as f:
            f.write("# Sample news websites\nhttps://www.reuters.com\nhttps://techcrunch.com\n")
        files_created.append('input/websites.txt')
    
    # Sample companies if file doesn't exist  
    if not os.path.exists('input/companies.txt'):
        with open('input/companies.txt', 'w') as f:
            f.write("# Sample companies\nApple\nMicrosoft\nTesla\n")
        files_created.append('input/companies.txt')
    
    # Sample keywords if file doesn't exist
    if not os.path.exists('input/keywords.txt'):
        with open('input/keywords.txt', 'w') as f:
            f.write("# Sample keywords\nacquisition\nmerger\npartnership\n")
        files_created.append('input/keywords.txt')
    
    if files_created:
        print(f"📝 Created sample files: {', '.join(files_created)}")
    
    return files_created

def main():
    """Main setup function"""
    print("🚀 News Crawler Setup")
    print("=" * 30)
    
    # Install requirements
    if not install_requirements():
        print("❌ Setup failed. Please install packages manually.")
        return 1
    
    # Create sample files
    create_sample_files()
    
    print("\n✅ Setup complete!")
    print("\n📋 Next steps:")
    print("1. Edit input/websites.txt with your target news websites")
    print("2. Edit input/companies.txt with companies to search for") 
    print("3. Edit input/keywords.txt with relevant keywords")
    print("4. Run: python news_crawler.py")
    print("   Or: python run_crawler.py (interactive mode)")
    print("5. Results will be saved in output/ directory")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
