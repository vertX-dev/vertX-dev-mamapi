import os
import json
import uuid
import re
import zipfile
import requests
from pathlib import Path
import argparse

CONFIG_FILE = 'fast_import_config.json'

class MinecraftManifestUpdater:
    def __init__(self, base_directory=None, telegram_config=None, addon_name=None, version_input=None):
        self.base_directory = Path(base_directory) if base_directory else None
        self.addon_name = addon_name
        self.version_input = version_input
        self.uuid_mapping = {}  # Store old UUID -> new UUID mapping
        self.updated_files = []
        self.errors = []
        self.max_version = 0  # Track the highest version number found
        
        # Telegram configuration
        self.telegram_config = telegram_config or {}
        self.bot_token = self.telegram_config.get('bot_token')
        self.chat_id = self.telegram_config.get('chat_id')
        self.send_to_telegram = self.bot_token and self.chat_id
        
    def generate_new_uuid(self):
        """Generate a new UUID in the format used by Minecraft"""
        return str(uuid.uuid4())
    
    def is_valid_uuid(self, uuid_string):
        """Check if a string is a valid UUID"""
        try:
            uuid.UUID(uuid_string)
            return True
        except ValueError:
            return False
    
    def find_manifest_files(self):
        """Find all manifest.json files in the directory structure"""
        manifest_files = []
        if not self.base_directory.exists():
            raise FileNotFoundError(f"Directory {self.base_directory} does not exist")
        
        for root, dirs, files in os.walk(self.base_directory):
            for file in files:
                if file.lower() == 'manifest.json':
                    manifest_files.append(Path(root) / file)
        
        return manifest_files
    
    def update_manifest_file(self, file_path):
        """Update a single manifest file with new UUID and incremented version"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            updated = False
            
            # Update header UUID if it exists
            if 'header' in data and 'uuid' in data['header']:
                old_uuid = data['header']['uuid']
                if self.is_valid_uuid(old_uuid):
                    if old_uuid not in self.uuid_mapping:
                        self.uuid_mapping[old_uuid] = self.generate_new_uuid()
                    data['header']['uuid'] = self.uuid_mapping[old_uuid]
                    updated = True
            
            # Update modules UUIDs if they exist
            if 'modules' in data:
                for module in data['modules']:
                    if 'uuid' in module:
                        old_uuid = module['uuid']
                        if self.is_valid_uuid(old_uuid):
                            if old_uuid not in self.uuid_mapping:
                                self.uuid_mapping[old_uuid] = self.generate_new_uuid()
                            module['uuid'] = self.uuid_mapping[old_uuid]
                            updated = True
            
            # Update dependencies UUIDs if they exist
            if 'dependencies' in data:
                for dep in data['dependencies']:
                    if 'uuid' in dep:
                        old_uuid = dep['uuid']
                        if self.is_valid_uuid(old_uuid):
                            if old_uuid not in self.uuid_mapping:
                                self.uuid_mapping[old_uuid] = self.generate_new_uuid()
                            dep['uuid'] = self.uuid_mapping[old_uuid]
                            updated = True
            
            # Update version and name with user input
            if 'header' in data and 'version' in data['header']:
                version = data['header']['version']
                new_version_number = None
                
                # Use user input version if provided
                if self.version_input is not None:
                    try:
                        new_version_number = int(self.version_input)
                        if isinstance(version, list) and len(version) >= 3:
                            version[2] = new_version_number
                            updated = True
                        elif isinstance(version, str):
                            version_parts = version.split('.')
                            if len(version_parts) >= 3:
                                version_parts[2] = str(new_version_number)
                                data['header']['version'] = '.'.join(version_parts)
                                updated = True
                    except ValueError:
                        # Fallback to increment logic if version_input is invalid
                        pass
                
                # If no user input or invalid input, use increment logic
                if new_version_number is None:
                    if isinstance(version, list) and len(version) >= 3:
                        # Increment patch version (third element)
                        version[2] += 1
                        new_version_number = version[2]
                        updated = True
                    elif isinstance(version, str):
                        # Handle string versions like "1.0.0"
                        version_parts = version.split('.')
                        if len(version_parts) >= 3:
                            try:
                                version_parts[2] = str(int(version_parts[2]) + 1)
                                data['header']['version'] = '.'.join(version_parts)
                                new_version_number = int(version_parts[2])
                                updated = True
                            except ValueError:
                                pass
                
                # Update addon name with new version using dynamic addon name
                if new_version_number is not None and 'name' in data['header']:
                    # Create new name with version template using addon_name
                    new_name = f"{self.addon_name} V{new_version_number}"
                    data['header']['name'] = new_name
                    updated = True
                    # Track the maximum version number
                    self.max_version = max(self.max_version, new_version_number)
                    print(f"  └─ Updated name to: {new_name}")
                elif 'name' in data['header']:
                    # If we can't determine version number, use a default pattern
                    current_name = data['header']['name']
                    # Extract version number from current name if possible
                    match = re.search(r'V(\d+)', current_name)
                    if match:
                        current_version = int(match.group(1))
                        new_version = current_version + 1
                        new_name = f"{self.addon_name} V{new_version}"
                        data['header']['name'] = new_name
                        updated = True
                        # Track the maximum version number
                        self.max_version = max(self.max_version, new_version)
                        print(f"  └─ Updated name to: {new_name}")
                    else:
                        # Default to V1 if no version found
                        new_name = f"{self.addon_name} V1"
                        data['header']['name'] = new_name
                        updated = True
                        # Track the maximum version number
                        self.max_version = max(self.max_version, 1)
                        print(f"  └─ Updated name to: {new_name}")
            
            if updated:
                # Write back to file with proper formatting
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                self.updated_files.append(str(file_path))
                print(f"✓ Updated: {file_path}")
            else:
                print(f"- No changes needed: {file_path}")
                
        except json.JSONDecodeError as e:
            error_msg = f"JSON error in {file_path}: {str(e)}"
            self.errors.append(error_msg)
            print(f"✗ {error_msg}")
        except Exception as e:
            error_msg = f"Error processing {file_path}: {str(e)}"
            self.errors.append(error_msg)
            print(f"✗ {error_msg}")
    
    def update_other_files(self):
        """Update UUIDs in other files that might reference them"""
        # Common file extensions that might contain UUIDs
        extensions = ['.json', '.js', '.ts', '.mcfunction', '.txt']
        
        for root, dirs, files in os.walk(self.base_directory):
            for file in files:
                file_path = Path(root) / file
                
                # Skip manifest files (already processed)
                if file.lower() == 'manifest.json':
                    continue
                
                # Only process files with relevant extensions
                if file_path.suffix.lower() not in extensions:
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Replace all old UUIDs with new ones
                    for old_uuid, new_uuid in self.uuid_mapping.items():
                        content = content.replace(old_uuid, new_uuid)
                    
                    # If content changed, write it back
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"✓ Updated references in: {file_path}")
                        
                except Exception as e:
                    error_msg = f"Error updating references in {file_path}: {str(e)}"
                    self.errors.append(error_msg)
                    print(f"✗ {error_msg}")
    
    def create_mcaddon_package(self):
        """Create a .mcaddon package from the updated addon"""
        try:
            # Determine the output filename using dynamic addon name and version
            version_to_use = self.version_input if self.version_input is not None else self.max_version
            output_name = f"ADDONS/{self.addon_name}/{self.addon_name} V{version_to_use}.mcaddon"
            output_path = Path(output_name)
            
            # Create parent directories if they don't exist
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Remove existing file if it exists
            if output_path.exists():
                output_path.unlink()
                print(f"Removed existing file: {output_name}")
            
            print(f"Creating mcaddon package: {output_name}")
            
            # Create zip file
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Walk through all files in the base directory
                for root, dirs, files in os.walk(self.base_directory):
                    for file in files:
                        file_path = Path(root) / file
                        # Calculate relative path from base directory
                        arcname = file_path.relative_to(self.base_directory)
                        zipf.write(file_path, arcname)
                        
            print(f"✓ Successfully created: {output_name}")
            
            # Get file size for display
            file_size = output_path.stat().st_size
            if file_size > 1024 * 1024:
                size_str = f"{file_size / (1024 * 1024):.1f} MB"
            elif file_size > 1024:
                size_str = f"{file_size / 1024:.1f} KB"
            else:
                size_str = f"{file_size} bytes"
            
            print(f"  └─ Package size: {size_str}")
            
            return str(output_path)
            
        except Exception as e:
            error_msg = f"Error creating mcaddon package: {str(e)}"
            self.errors.append(error_msg)
            print(f"✗ {error_msg}")
            return None
    
    def send_telegram_message(self, message):
        """Send a text message to Telegram"""
        if not self.send_to_telegram:
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            data = {
                'chat_id': self.chat_id,
                'text': message,
                'parse_mode': 'Markdown'
            }
            response = requests.post(url, data=data, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"✗ Error sending Telegram message: {str(e)}")
            return False
    
    def send_telegram_file(self, file_path, caption=None):
        """Send a file to Telegram"""
        if not self.send_to_telegram:
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.bot_token}/sendDocument"
            
            with open(file_path, 'rb') as file:
                files = {'document': file}
                data = {
                    'chat_id': self.chat_id,
                    'caption': caption or '',
                    'parse_mode': 'Markdown'
                }
                response = requests.post(url, files=files, data=data, timeout=30)
                return response.status_code == 200
        except Exception as e:
            print(f"✗ Error sending Telegram file: {str(e)}")
            return False
    
    def run(self):
        """Run the complete update process"""
        if not self.base_directory:
            print("Error: No base directory selected!")
            return
            
        print(f"Starting Minecraft manifest update process...")
        print(f"Base directory: {self.base_directory.absolute()}")
        
        if self.send_to_telegram:
            print(f"Telegram bot enabled - will send to chat ID: {self.chat_id}")
        else:
            print("Telegram bot disabled")
        
        print("-" * 50)
        
        try:
            # Send initial notification to Telegram
            if self.send_to_telegram:
                initial_message = f"🔄 *{self.addon_name} Update Started*\n\n📁 Processing directory: `{self.base_directory.name}`\n⏰ Starting update process..."
                self.send_telegram_message(initial_message)
            
            # Find all manifest files
            manifest_files = self.find_manifest_files()
            
            if not manifest_files:
                print("No manifest.json files found!")
                if self.send_to_telegram:
                    self.send_telegram_message("❌ *Update Failed*\n\nNo manifest.json files found in the directory.")
                return
            
            print(f"Found {len(manifest_files)} manifest file(s)")
            print()
            
            # Update each manifest file
            for manifest_file in manifest_files:
                self.update_manifest_file(manifest_file)
            
            print()
            print("Updating UUID references in other files...")
            
            # Update references in other files
            self.update_other_files()
            
            print()
            print("Creating mcaddon package...")
            
            # Create the mcaddon package
            package_path = self.create_mcaddon_package()
            
            print()
            print("-" * 50)
            print("Update Summary:")
            print(f"✓ Files updated: {len(self.updated_files)}")
            print(f"✓ UUIDs generated: {len(self.uuid_mapping)}")
            print(f"✓ Addon names updated to {self.addon_name} V<x> format")
            version_to_display = self.version_input if self.version_input is not None else self.max_version
            print(f"✓ Version: V{version_to_display}")
            if package_path:
                print(f"✓ McAddon package created: {package_path}")
            print(f"✗ Errors: {len(self.errors)}")
            
            # Send results to Telegram
            if self.send_to_telegram:
                # Create summary message
                summary_message = f"✅ *{self.addon_name} Update Complete*\n\n"
                summary_message += f"📊 **Summary:**\n"
                summary_message += f"• Files updated: `{len(self.updated_files)}`\n"
                summary_message += f"• UUIDs generated: `{len(self.uuid_mapping)}`\n"
                summary_message += f"• Version: `{self.addon_name} V{version_to_display}`\n"
                
                if self.errors:
                    summary_message += f"• Errors: `{len(self.errors)}`\n"
                
                if package_path:
                    file_size = Path(package_path).stat().st_size
                    if file_size > 1024 * 1024:
                        size_str = f"{file_size / (1024 * 1024):.1f} MB"
                    elif file_size > 1024:
                        size_str = f"{file_size / 1024:.1f} KB"
                    else:
                        size_str = f"{file_size} bytes"
                    
                    summary_message += f"• Package size: `{size_str}`\n"
                    summary_message += f"\n📦 Sending addon file..."
                    
                    # Send summary first
                    self.send_telegram_message(summary_message)
                    
                    # Then send the file
                    file_caption = f"📱 *{self.addon_name} V{version_to_display}*\n\n🔧 Updated with new UUIDs and version\n💾 Ready to install in Minecraft"
                    
                    if self.send_telegram_file(package_path, file_caption):
                        print("✓ McAddon file sent to Telegram successfully!")
                    else:
                        print("✗ Failed to send McAddon file to Telegram")
                        error_msg = "❌ *File Send Failed*\n\nCould not send the mcaddon file to Telegram. Please check the file manually."
                        self.send_telegram_message(error_msg)
                else:
                    summary_message += f"\n❌ Package creation failed"
                    self.send_telegram_message(summary_message)
            
            if self.uuid_mapping:
                print("\nUUID Mapping:")
                for old_uuid, new_uuid in self.uuid_mapping.items():
                    print(f"  {old_uuid} -> {new_uuid}")
            
            if self.errors:
                print("\nErrors:")
                for error in self.errors:
                    print(f"  {error}")
                
                if self.send_to_telegram:
                    error_message = f"⚠️ *Errors Encountered*\n\n"
                    for i, error in enumerate(self.errors[:5], 1):  # Limit to first 5 errors
                        error_message += f"{i}. `{error}`\n"
                    if len(self.errors) > 5:
                        error_message += f"\n... and {len(self.errors) - 5} more errors"
                    self.send_telegram_message(error_message)
            
        except Exception as e:
            print(f"Fatal error: {str(e)}")
            if self.send_to_telegram:
                error_message = f"💥 *Fatal Error*\n\n`{str(e)}`\n\nUpdate process failed."
                self.send_telegram_message(error_message)

def select_folder():
    """Manual folder selection for Minecraft addon directory"""
    print("\nPlease select the Minecraft addon folder.")
    print("Current directory:", os.getcwd())
    print("\nAvailable folders in current directory:")
    
    # List directories in current folder
    try:
        current_dir = Path(os.getcwd())
        directories = [d for d in current_dir.iterdir() if d.is_dir()]
        
        if directories:
            for i, directory in enumerate(directories, 1):
                print(f"  {i}. {directory.name}")
            print(f"  {len(directories) + 1}. Enter custom path")
        else:
            print("  No directories found")
            print("  1. Enter custom path")
        
        print()
        
        # Get user choice
        while True:
            try:
                if directories:
                    choice = input(f"Select folder (1-{len(directories) + 1}) or enter path directly: ").strip()
                else:
                    choice = input("Enter folder path: ").strip()
                
                # If it's a number, try to select from list
                if choice.isdigit():
                    choice_num = int(choice)
                    if 1 <= choice_num <= len(directories):
                        selected_path = str(directories[choice_num - 1])
                        break
                    elif choice_num == len(directories) + 1:
                        # Custom path option
                        selected_path = input("Enter full folder path: ").strip()
                        break
                    else:
                        print("Invalid choice. Please try again.")
                        continue
                else:
                    # Direct path entry
                    selected_path = choice
                    break
                    
            except KeyboardInterrupt:
                print("\nOperation cancelled.")
                return None
            except Exception as e:
                print(f"Error: {e}")
                continue
        
        # Validate path
        if selected_path:
            path_obj = Path(selected_path)
            if path_obj.exists() and path_obj.is_dir():
                return str(path_obj.absolute())
            else:
                print(f"Path does not exist or is not a directory: {selected_path}")
                return None
        else:
            return None
            
    except Exception as e:
        print(f"Error listing directories: {e}")
        # Fallback to simple input
        try:
            selected_path = input("Enter folder path: ").strip()
            if selected_path:
                path_obj = Path(selected_path)
                if path_obj.exists() and path_obj.is_dir():
                    return str(path_obj.absolute())
                else:
                    print(f"Path does not exist or is not a directory: {selected_path}")
                    return None
            return None
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return None

def load_telegram_config():
    """Load Telegram configuration from environment variables or config file"""
    config = {}
    
    # Try to load from environment variables first
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if bot_token and chat_id:
        config['bot_token'] = bot_token
        config['chat_id'] = chat_id
        return config
    
    # Try to load from config file
    config_file = Path('telegram_config.json')
    if config_file.exists():
        try:
            with open(config_file, 'r') as f:
                file_config = json.load(f)
                if 'bot_token' in file_config and 'chat_id' in file_config:
                    config.update(file_config)
                    return config
        except Exception as e:
            print(f"Error loading telegram config file: {e}")
    
    return config

def create_telegram_config_template():
    """Create a template configuration file for Telegram"""
    config_template = {
        "bot_token": "YOUR_BOT_TOKEN_HERE",
        "chat_id": "YOUR_CHAT_ID_HERE",
        "_instructions": {
            "how_to_get_bot_token": "1. Message @BotFather on Telegram, 2. Send /newbot, 3. Follow instructions, 4. Copy the token",
            "how_to_get_chat_id": "1. Message @userinfobot on Telegram, 2. It will reply with your chat ID, 3. Copy the ID number",
            "alternative_method": "Set environment variables: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID"
        }
    }
    
    config_file = Path('telegram_config.json')
    with open(config_file, 'w') as f:
        json.dump(config_template, f, indent=2)
    
    print(f"Created telegram configuration template: {config_file}")
    print("Please edit the file with your actual bot token and chat ID.")

# --- GUI Section ---
def launch_gui():
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox

    class FastImportGUI:
        def __init__(self, root):
            self.root = root
            self.root.title('FAST IMPORT GUI')
            self.root.geometry('500x400')
            self.config = self.load_config()
            self.create_widgets()
            self.prefill_from_config()

        def create_widgets(self):
            main_frame = ttk.Frame(self.root, padding=20)
            main_frame.pack(fill=tk.BOTH, expand=True)

            # Folder selection
            folder_frame = ttk.Frame(main_frame)
            folder_frame.pack(fill=tk.X, pady=5)
            ttk.Label(folder_frame, text='Addon Folder:').pack(side=tk.LEFT)
            self.folder_var = tk.StringVar()
            folder_entry = ttk.Entry(folder_frame, textvariable=self.folder_var, width=40)
            folder_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
            ttk.Button(folder_frame, text='Browse', command=self.browse_folder).pack(side=tk.LEFT)

            # Addon name
            name_frame = ttk.Frame(main_frame)
            name_frame.pack(fill=tk.X, pady=5)
            ttk.Label(name_frame, text='Addon Name:').pack(side=tk.LEFT)
            self.name_var = tk.StringVar()
            ttk.Entry(name_frame, textvariable=self.name_var, width=30).pack(side=tk.LEFT, padx=5)

            # Version
            version_frame = ttk.Frame(main_frame)
            version_frame.pack(fill=tk.X, pady=5)
            ttk.Label(version_frame, text='Version: v').pack(side=tk.LEFT)
            self.main_version_var = tk.StringVar()
            self.sub_version_var = tk.StringVar()
            ttk.Entry(version_frame, textvariable=self.main_version_var, width=5).pack(side=tk.LEFT)
            ttk.Label(version_frame, text='.').pack(side=tk.LEFT)
            ttk.Entry(version_frame, textvariable=self.sub_version_var, width=5).pack(side=tk.LEFT)

            # Beta version
            self.beta_var = tk.BooleanVar()
            ttk.Checkbutton(main_frame, text='Beta Version', variable=self.beta_var).pack(anchor=tk.W, pady=5)

            # Pack type
            packtype_frame = ttk.LabelFrame(main_frame, text='Pack Type', padding=10)
            packtype_frame.pack(fill=tk.X, pady=5)
            self.behavior_var = tk.BooleanVar()
            self.resource_var = tk.BooleanVar()
            ttk.Checkbutton(packtype_frame, text='Behavior Pack', variable=self.behavior_var).pack(side=tk.LEFT, padx=10)
            ttk.Checkbutton(packtype_frame, text='Resource Pack', variable=self.resource_var).pack(side=tk.LEFT, padx=10)

            # Repeat import
            self.repeat_var = tk.BooleanVar()
            ttk.Checkbutton(main_frame, text='Repeat Last Import (auto-increment sub-version)', variable=self.repeat_var, command=self.on_repeat_toggle).pack(anchor=tk.W, pady=5)

            # Import button
            ttk.Button(main_frame, text='Run Import', command=self.run_import).pack(pady=20)

        def browse_folder(self):
            folder = filedialog.askdirectory(title='Select Addon Folder')
            if folder:
                self.folder_var.set(folder)

        def prefill_from_config(self):
            if not self.config:
                return
            self.folder_var.set(self.config.get('folder', ''))
            self.name_var.set(self.config.get('name', ''))
            self.main_version_var.set(str(self.config.get('main_version', '1')))
            self.sub_version_var.set(str(self.config.get('sub_version', '0')))
            self.beta_var.set(self.config.get('beta', False))
            self.behavior_var.set(self.config.get('behavior', True))
            self.resource_var.set(self.config.get('resource', False))

        def on_repeat_toggle(self):
            if self.repeat_var.get() and self.config:
                # Load config and increment sub-version
                self.folder_var.set(self.config.get('folder', ''))
                self.name_var.set(self.config.get('name', ''))
                self.main_version_var.set(str(self.config.get('main_version', '1')))
                sub = int(self.config.get('sub_version', 0)) + 1
                self.sub_version_var.set(str(sub))
                self.beta_var.set(self.config.get('beta', False))
                self.behavior_var.set(self.config.get('behavior', True))
                self.resource_var.set(self.config.get('resource', False))

        def run_import(self):
            folder = self.folder_var.get().strip()
            name = self.name_var.get().strip()
            main_version = self.main_version_var.get().strip()
            sub_version = self.sub_version_var.get().strip()
            beta = self.beta_var.get()
            behavior = self.behavior_var.get()
            resource = self.resource_var.get()

            if not folder or not os.path.isdir(folder):
                messagebox.showerror('Error', 'Please select a valid addon folder.')
                return
            if not name:
                messagebox.showerror('Error', 'Please enter an addon name.')
                return
            if not main_version.isdigit() or not sub_version.isdigit():
                messagebox.showerror('Error', 'Version must be numeric.')
                return
            if not (behavior or resource):
                messagebox.showerror('Error', 'Select at least one pack type.')
                return

            # Save config for repeat import
            config = {
                'folder': folder,
                'name': name,
                'main_version': int(main_version),
                'sub_version': int(sub_version),
                'beta': beta,
                'behavior': behavior,
                'resource': resource
            }
            self.save_config(config)

            # Call main() with these arguments
            try:
                main(
                    folder=folder,
                    name=name,
                    main_version=int(main_version),
                    sub_version=int(sub_version),
                    behavior=behavior,
                    resource=resource,
                    beta=beta,
                    gui_mode=True
                )
                messagebox.showinfo('Success', f'Import completed for {name} v{main_version}.{sub_version}')
            except Exception as e:
                messagebox.showerror('Error', f'Import failed: {e}')

        def load_config(self):
            if os.path.exists(CONFIG_FILE):
                try:
                    with open(CONFIG_FILE, 'r') as f:
                        return json.load(f)
                except Exception:
                    return None
            return None

        def save_config(self, config):
            try:
                with open(CONFIG_FILE, 'w') as f:
                    json.dump(config, f, indent=2)
            except Exception:
                pass

    root = tk.Tk()
    app = FastImportGUI(root)
    root.mainloop()

# --- END GUI Section ---

def main(folder=None, name=None, main_version=None, sub_version=None, behavior=None, resource=None, beta=None, gui_mode=False):
    # If called with all args, run CLI logic, else run interactive
    if folder and name and main_version is not None and sub_version is not None:
        selected_folder = folder
        addon_name = name
        version_input = sub_version
        behavior = bool(behavior)
        resource = bool(resource)
        beta = bool(beta)
        # Compose version string
        version_str = f"v{main_version}.{sub_version}"
        if beta:
            version_str += ' Beta'
        if not gui_mode:
            print(f"[CLI] Importing: {addon_name} {version_str}")
        telegram_config = load_telegram_config()
        updater = MinecraftManifestUpdater(
            base_directory=selected_folder,
            telegram_config=telegram_config,
            addon_name=addon_name,
            version_input=sub_version
        )
        # Save config for repeat import
        config = {
            'folder': selected_folder,
            'name': addon_name,
            'main_version': main_version,
            'sub_version': sub_version,
            'beta': beta,
            'behavior': behavior,
            'resource': resource
        }
        try:
            with open(CONFIG_FILE, 'w') as f:
                json.dump(config, f, indent=2)
        except Exception:
            pass
        # --- Manifest logic for separation and dependencies ---
        manifest_files = updater.find_manifest_files()
        behavior_manifest = None
        resource_manifest = None
        for mf in manifest_files:
            p = str(mf).lower()
            if 'behavior' in p or 'bp' in p:
                behavior_manifest = mf
            elif 'resource' in p or 'rp' in p:
                resource_manifest = mf
        behavior_uuid = str(uuid.uuid4()) if behavior else None
        resource_uuid = str(uuid.uuid4()) if resource else None
        for mf in manifest_files:
            try:
                with open(mf, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                data['header']['version'] = [main_version, sub_version, 0]
                name_str = f"{addon_name} v{main_version}.{sub_version}"
                if beta:
                    name_str += ' Beta'
                data['header']['name'] = name_str
                if 'behavior' in str(mf).lower() and behavior_uuid:
                    data['header']['uuid'] = behavior_uuid
                    for m in data.get('modules', []):
                        m['uuid'] = behavior_uuid
                if 'resource' in str(mf).lower() and resource_uuid:
                    data['header']['uuid'] = resource_uuid
                    for m in data.get('modules', []):
                        m['uuid'] = resource_uuid
                if 'behavior' in str(mf).lower() and resource_uuid:
                    data['dependencies'] = [{
                        'uuid': resource_uuid,
                        'version': [main_version, sub_version, 0]
                    }]
                if 'resource' in str(mf).lower() and behavior_uuid:
                    data['dependencies'] = [{
                        'uuid': behavior_uuid,
                        'version': [main_version, sub_version, 0]
                    }]
                with open(mf, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                if not gui_mode:
                    print(f"Updated manifest: {mf}")
            except Exception as e:
                if not gui_mode:
                    print(f"Error updating manifest {mf}: {e}")
        updater.run()
        return
    # Interactive mode fallback
    print("Minecraft Addon Updater with Telegram Integration")
    print("=" * 50)
    
    # Load Telegram configuration
    telegram_config = load_telegram_config()
    
    if not telegram_config:
        print("No Telegram configuration found.")
        print("Would you like to create a configuration template? (y/n): ", end="")
        try:
            response = input().strip().lower()
            if response in ['y', 'yes']:
                create_telegram_config_template()
                print("\nPlease configure your Telegram settings and run the script again.")
                return
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return
        
        print("Continuing without Telegram integration...")
    else:
        print("Telegram integration enabled ✓")
    
    print()
    
    # Select folder
    selected_folder = select_folder()
    
    if not selected_folder:
        print("No folder selected. Exiting...")
        return
    
    print(f"Selected folder: {selected_folder}")
    
    # Confirm selection
    print(f"\nProcessing folder: {selected_folder}")
    print("Continue? (y/n): ", end="")
    try:
        response = input().strip().lower()
        if response not in ['y', 'yes']:
            print("Operation cancelled.")
            return
    except KeyboardInterrupt:
        print("\nOperation cancelled.")
        return
    
    print()
    
    # Get addon name
    addon_name = input("Enter addon name: ").strip()
    while not addon_name:
        print("Addon name cannot be empty!")
        addon_name = input("Enter addon name: ").strip()
    
    # Get version number
    while True:
        try:
            version_input = int(input("Enter version number: ").strip())
            if version_input > 0:
                break
            print("Version must be a positive number!")
        except ValueError:
            print("Please enter a valid number!")
    
    # Run the updater with selected folder
    updater = MinecraftManifestUpdater(
        base_directory=selected_folder,
        telegram_config=telegram_config,
        addon_name=addon_name,
        version_input=version_input
    )
    updater.run()

if __name__ == "__main__":
    args = parse_cli_args()
    if (
        args.gui or
        (not any([args.folder, args.name, args.main_version, args.sub_version, args.behavior, args.resource, args.beta]))
    ):
        launch_gui()
    else:
        main(
            folder=args.folder,
            name=args.name,
            main_version=args.main_version,
            sub_version=args.sub_version,
            behavior=(str(args.behavior).lower() == 'true') if args.behavior is not None else None,
            resource=(str(args.resource).lower() == 'true') if args.resource is not None else None,
            beta=(str(args.beta).lower() == 'true') if args.beta is not None else None,
            gui_mode=False
        )