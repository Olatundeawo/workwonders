#!/usr/bin/env python3
"""
Helper script to enable URL logging in the news crawler
"""

import json
import os

def enable_url_logging():
    """Enable URL logging in config.json"""
    config_file = 'config.json'
    
    if not os.path.exists(config_file):
        print(f"❌ Config file {config_file} not found!")
        return False
    
    try:
        with open(config_file, 'r') as f:
            config = json.load(f)
        
        # Show current settings
        print("Current logging settings:")
        print(f"  log_level: {config.get('log_level', 'INFO')}")
        print(f"  log_urls: {config.get('log_urls', False)}")
        print(f"  log_url_details: {config.get('log_url_details', False)}")
        
        print("\nLogging options:")
        print("1. Enable basic URL logging (shows URLs as they're found)")
        print("2. Enable detailed URL logging (shows URLs with titles/metadata)")
        print("3. Enable DEBUG level (shows all crawler internals)")
        print("4. Enable everything (DEBUG + detailed URL logging)")
        print("5. Disable all URL logging")
        print("6. Cancel")
        
        choice = input("\nSelect option (1-6): ").strip()
        
        if choice == '1':
            config['log_urls'] = True
            config['log_url_details'] = False
            config['log_level'] = 'INFO'
            print("✅ Enabled basic URL logging")
            
        elif choice == '2':
            config['log_urls'] = True
            config['log_url_details'] = True
            config['log_level'] = 'DEBUG'
            print("✅ Enabled detailed URL logging")
            
        elif choice == '3':
            config['log_urls'] = False
            config['log_url_details'] = False
            config['log_level'] = 'DEBUG'
            print("✅ Enabled DEBUG level logging")
            
        elif choice == '4':
            config['log_urls'] = True
            config['log_url_details'] = True
            config['log_level'] = 'DEBUG'
            print("✅ Enabled all logging (DEBUG + detailed URLs)")
            
        elif choice == '5':
            config['log_urls'] = False
            config['log_url_details'] = False
            config['log_level'] = 'INFO'
            print("✅ Disabled URL logging")
            
        elif choice == '6':
            print("Operation cancelled")
            return True
            
        else:
            print("❌ Invalid choice")
            return False
        
        # Save config
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"\n✅ Config saved to {config_file}")
        print("\nNew settings:")
        print(f"  log_level: {config['log_level']}")
        print(f"  log_urls: {config['log_urls']}")  
        print(f"  log_url_details: {config['log_url_details']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating config: {e}")
        return False

def main():
    """Main function"""
    print("🔧 URL Logging Configuration Tool")
    print("=" * 40)
    
    if enable_url_logging():
        print("\n💡 Note: URL details are logged at DEBUG level.")
        print("   Check 'news_crawler.log' for output when running the crawler.")
        print("\n🚀 You can now run the crawler to see URL logging in action!")
    else:
        print("\n❌ Configuration failed.")

if __name__ == "__main__":
    main()
