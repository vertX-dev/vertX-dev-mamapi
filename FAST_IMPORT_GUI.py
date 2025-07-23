import os
import json
import uuid
import re
import zipfile
import requests
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import threading
from datetime import datetime

class MinecraftAddonGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Minecraft Addon Import Tool")
        self.root.geometry("800x700")
        self.root.minsize(700, 600)
        
        # Configuration file path
        self.config_file = Path("addon_import_config.json")
        
        # Variables
        self.base_directory = tk.StringVar()
        self.addon_name = tk.StringVar()
        self.main_version = tk.StringVar(value="1")
        self.sub_version = tk.StringVar(value="0")
        self.pack_type = tk.StringVar(value="both")
        self.is_beta = tk.BooleanVar()
        self.bot_token = tk.StringVar()
        self.chat_id = tk.StringVar()
        
        # Load configuration
        self.load_config()
        
        self.setup_ui()
        
    def setup_ui(self):
        # Create main frame with scrollbar
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Title
        title_label = ttk.Label(main_frame, text="Minecraft Addon Import Tool", 
                               font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 20))
        
        # Directory selection
        dir_frame = ttk.LabelFrame(main_frame, text="Directory Selection", padding=10)
        dir_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(dir_frame, text="Addon Directory:").pack(anchor=tk.W)
        dir_entry_frame = ttk.Frame(dir_frame)
        dir_entry_frame.pack(fill=tk.X, pady=(5, 0))
        
        ttk.Entry(dir_entry_frame, textvariable=self.base_directory, state="readonly").pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(dir_entry_frame, text="Browse", command=self.browse_directory).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Addon configuration
        config_frame = ttk.LabelFrame(main_frame, text="Addon Configuration", padding=10)
        config_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Row 1: Name and Type
        row1 = ttk.Frame(config_frame)
        row1.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(row1, text="Addon Name:").pack(side=tk.LEFT)
        ttk.Entry(row1, textvariable=self.addon_name, width=25).pack(side=tk.LEFT, padx=(5, 20))
        
        ttk.Label(row1, text="Pack Type:").pack(side=tk.LEFT)
        pack_combo = ttk.Combobox(row1, textvariable=self.pack_type, values=["both", "behavior", "resource"], 
                                 state="readonly", width=10)
        pack_combo.pack(side=tk.LEFT, padx=(5, 0))
        
        # Row 2: Version and Beta
        row2 = ttk.Frame(config_frame)
        row2.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(row2, text="Version:").pack(side=tk.LEFT)
        ttk.Label(row2, text="v").pack(side=tk.LEFT, padx=(5, 0))
        ttk.Entry(row2, textvariable=self.main_version, width=5).pack(side=tk.LEFT)
        ttk.Label(row2, text=".").pack(side=tk.LEFT)
        ttk.Entry(row2, textvariable=self.sub_version, width=5).pack(side=tk.LEFT)
        
        ttk.Checkbutton(row2, text="Beta Version", variable=self.is_beta).pack(side=tk.LEFT, padx=(20, 0))
        
        # Repeat import section
        repeat_frame = ttk.LabelFrame(main_frame, text="Repeat Import", padding=10)
        repeat_frame.pack(fill=tk.X, pady=(0, 10))
        
        repeat_buttons = ttk.Frame(repeat_frame)
        repeat_buttons.pack(fill=tk.X)
        
        ttk.Button(repeat_buttons, text="Load Previous Config", 
                  command=self.load_previous_config).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(repeat_buttons, text="Increment Sub Version", 
                  command=self.increment_sub_version).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(repeat_buttons, text="Save Current Config", 
                  command=self.save_config).pack(side=tk.LEFT)
        
        # Telegram configuration
        telegram_frame = ttk.LabelFrame(main_frame, text="Telegram Integration (Optional)", padding=10)
        telegram_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Bot token
        token_row = ttk.Frame(telegram_frame)
        token_row.pack(fill=tk.X, pady=(0, 5))
        ttk.Label(token_row, text="Bot Token:", width=12).pack(side=tk.LEFT)
        ttk.Entry(token_row, textvariable=self.bot_token, show="*").pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Chat ID
        chat_row = ttk.Frame(telegram_frame)
        chat_row.pack(fill=tk.X)
        ttk.Label(chat_row, text="Chat ID:", width=12).pack(side=tk.LEFT)
        ttk.Entry(chat_row, textvariable=self.chat_id).pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Action buttons
        action_frame = ttk.Frame(main_frame)
        action_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(action_frame, text="Start Import", command=self.start_import, 
                  style="Accent.TButton").pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(action_frame, text="Clear Log", command=self.clear_log).pack(side=tk.LEFT)
        
        # Progress bar
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.pack(fill=tk.X, pady=(10, 5))
        
        # Log output
        log_frame = ttk.LabelFrame(main_frame, text="Log Output", padding=5)
        log_frame.pack(fill=tk.BOTH, expand=True, pady=(5, 0))
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=15, wrap=tk.WORD)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
    def log(self, message):
        """Add message to log with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
        
    def clear_log(self):
        """Clear the log output"""
        self.log_text.delete(1.0, tk.END)
        
    def browse_directory(self):
        """Browse for addon directory"""
        directory = filedialog.askdirectory(title="Select Minecraft Addon Directory")
        if directory:
            self.base_directory.set(directory)
            
    def load_config(self):
        """Load configuration from file"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                    
                self.base_directory.set(config.get('base_directory', ''))
                self.addon_name.set(config.get('addon_name', ''))
                self.main_version.set(config.get('main_version', '1'))
                self.sub_version.set(config.get('sub_version', '0'))
                self.pack_type.set(config.get('pack_type', 'both'))
                self.is_beta.set(config.get('is_beta', False))
                self.bot_token.set(config.get('bot_token', ''))
                self.chat_id.set(config.get('chat_id', ''))
                
            except Exception as e:
                self.log(f"Error loading config: {e}")
                
    def save_config(self):
        """Save current configuration to file"""
        try:
            config = {
                'base_directory': self.base_directory.get(),
                'addon_name': self.addon_name.get(),
                'main_version': self.main_version.get(),
                'sub_version': self.sub_version.get(),
                'pack_type': self.pack_type.get(),
                'is_beta': self.is_beta.get(),
                'bot_token': self.bot_token.get(),
                'chat_id': self.chat_id.get(),
                'last_saved': datetime.now().isoformat()
            }
            
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=2)
                
            self.log("Configuration saved successfully!")
            messagebox.showinfo("Success", "Configuration saved!")
            
        except Exception as e:
            self.log(f"Error saving config: {e}")
            messagebox.showerror("Error", f"Failed to save config: {e}")
            
    def load_previous_config(self):
        """Load previous configuration"""
        self.load_config()
        self.log("Previous configuration loaded!")
        
    def increment_sub_version(self):
        """Increment the sub version number"""
        try:
            current_sub = int(self.sub_version.get())
            self.sub_version.set(str(current_sub + 1))
            self.log(f"Sub version incremented to {self.sub_version.get()}")
        except ValueError:
            self.sub_version.set("1")
            self.log("Sub version reset to 1")
            
    def validate_inputs(self):
        """Validate user inputs"""
        if not self.base_directory.get():
            messagebox.showerror("Error", "Please select an addon directory!")
            return False
            
        if not Path(self.base_directory.get()).exists():
            messagebox.showerror("Error", "Selected directory does not exist!")
            return False
            
        if not self.addon_name.get().strip():
            messagebox.showerror("Error", "Please enter an addon name!")
            return False
            
        try:
            int(self.main_version.get())
            int(self.sub_version.get())
        except ValueError:
            messagebox.showerror("Error", "Version numbers must be integers!")
            return False
            
        return True
        
    def start_import(self):
        """Start the import process in a separate thread"""
        if not self.validate_inputs():
            return
            
        # Disable UI during processing
        self.root.config(cursor="wait")
        self.progress.start()
        
        # Start processing in separate thread
        thread = threading.Thread(target=self.run_import)
        thread.daemon = True
        thread.start()
        
    def run_import(self):
        """Run the import process"""
        try:
            # Create telegram config
            telegram_config = {}
            if self.bot_token.get() and self.chat_id.get():
                telegram_config = {
                    'bot_token': self.bot_token.get(),
                    'chat_id': self.chat_id.get()
                }
            
            # Create version string
            version_str = f"v{self.main_version.get()}.{self.sub_version.get()}"
            if self.is_beta.get():
                version_str += "-beta"
                
            # Create updater instance
            updater = MinecraftManifestUpdater(
                base_directory=self.base_directory.get(),
                telegram_config=telegram_config,
                addon_name=self.addon_name.get(),
                version_format=version_str,
                pack_type=self.pack_type.get(),
                is_beta=self.is_beta.get(),
                log_callback=self.log
            )
            
            # Run the update process
            updater.run()
            
            # Save config after successful import
            self.save_config()
            
        except Exception as e:
            self.log(f"Fatal error: {str(e)}")
            self.root.after(0, lambda: messagebox.showerror("Error", f"Import failed: {str(e)}"))
        finally:
            # Re-enable UI
            self.root.after(0, self.finish_import)
            
    def finish_import(self):
        """Finish import and re-enable UI"""
        self.progress.stop()
        self.root.config(cursor="")


class MinecraftManifestUpdater:
    def __init__(self, base_directory=None, telegram_config=None, addon_name=None, 
                 version_format=None, pack_type="both", is_beta=False, log_callback=None):
        self.base_directory = Path(base_directory) if base_directory else None
        self.addon_name = addon_name
        self.version_format = version_format
        self.pack_type = pack_type
        self.is_beta = is_beta
        self.log_callback = log_callback or print
        
        self.uuid_mapping = {}
        self.updated_files = []
        self.errors = []
        
        # Parse version format
        self.main_version, self.sub_version = self.parse_version_format(version_format)
        
        # Telegram configuration
        self.telegram_config = telegram_config or {}
        self.bot_token = self.telegram_config.get('bot_token')
        self.chat_id = self.telegram_config.get('chat_id')
        self.send_to_telegram = self.bot_token and self.chat_id
        
    def parse_version_format(self, version_format):
        """Parse version format v<main>.<sub>[-beta]"""
        if not version_format:
            return 1, 0
            
        # Remove 'v' prefix and '-beta' suffix
        version_clean = version_format.replace('v', '').replace('-beta', '')
        
        try:
            parts = version_clean.split('.')
            main_version = int(parts[0]) if len(parts) > 0 else 1
            sub_version = int(parts[1]) if len(parts) > 1 else 0
            return main_version, sub_version
        except (ValueError, IndexError):
            return 1, 0
            
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
    
    def get_pack_dependencies(self, pack_type):
        """Get correct dependencies based on pack type"""
        dependencies = []
        
        if pack_type == "behavior" or pack_type == "both":
            # Behavior pack dependencies
            dependencies.extend([
                {
                    "module_name": "@minecraft/server",
                    "version": "1.8.0-beta" if self.is_beta else "1.8.0"
                },
                {
                    "module_name": "@minecraft/server-ui",
                    "version": "1.2.0-beta" if self.is_beta else "1.2.0"
                }
            ])
            
        if pack_type == "resource" or pack_type == "both":
            # Resource pack dependencies
            dependencies.extend([
                {
                    "uuid": "66c6e9a8-3093-462a-9c36-dbb052165822",
                    "version": [1, 20, 0]
                }
            ])
            
        return dependencies
    
    def update_manifest_file(self, file_path):
        """Update a single manifest file with new UUID and version"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            updated = False
            
            # Determine pack type from file path or content
            current_pack_type = self.determine_pack_type(file_path, data)
            
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
            
            # Update dependencies with correct pack-specific dependencies
            if current_pack_type in ["behavior", "resource", "both"]:
                data['dependencies'] = self.get_pack_dependencies(current_pack_type)
                updated = True
            
            # Update version and name
            if 'header' in data:
                # Update version
                if 'version' in data['header']:
                    if isinstance(data['header']['version'], list):
                        data['header']['version'] = [self.main_version, self.sub_version, 0]
                    else:
                        data['header']['version'] = f"{self.main_version}.{self.sub_version}.0"
                    updated = True
                
                # Update name
                if 'name' in data['header']:
                    version_suffix = f"v{self.main_version}.{self.sub_version}"
                    if self.is_beta:
                        version_suffix += "-beta"
                    
                    pack_suffix = ""
                    if current_pack_type == "behavior":
                        pack_suffix = " [BP]"
                    elif current_pack_type == "resource":
                        pack_suffix = " [RP]"
                    
                    new_name = f"{self.addon_name} {version_suffix}{pack_suffix}"
                    data['header']['name'] = new_name
                    updated = True
                    self.log_callback(f"  └─ Updated name to: {new_name}")
            
            if updated:
                # Write back to file with proper formatting
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                self.updated_files.append(str(file_path))
                self.log_callback(f"✓ Updated: {file_path}")
            else:
                self.log_callback(f"- No changes needed: {file_path}")
                
        except json.JSONDecodeError as e:
            error_msg = f"JSON error in {file_path}: {str(e)}"
            self.errors.append(error_msg)
            self.log_callback(f"✗ {error_msg}")
        except Exception as e:
            error_msg = f"Error processing {file_path}: {str(e)}"
            self.errors.append(error_msg)
            self.log_callback(f"✗ {error_msg}")
    
    def determine_pack_type(self, file_path, data):
        """Determine pack type from file path or manifest content"""
        path_str = str(file_path).lower()
        
        # Check path for indicators
        if 'behavior' in path_str or 'bp' in path_str:
            return "behavior"
        elif 'resource' in path_str or 'rp' in path_str:
            return "resource"
        
        # Check manifest content
        if 'modules' in data:
            for module in data['modules']:
                module_type = module.get('type', '').lower()
                if module_type in ['data', 'script']:
                    return "behavior"
                elif module_type in ['resources', 'skin_pack']:
                    return "resource"
        
        # Default to the specified pack type
        return self.pack_type
    
    def update_other_files(self):
        """Update UUIDs in other files that might reference them"""
        extensions = ['.json', '.js', '.ts', '.mcfunction', '.txt']
        
        for root, dirs, files in os.walk(self.base_directory):
            for file in files:
                file_path = Path(root) / file
                
                if file.lower() == 'manifest.json':
                    continue
                
                if file_path.suffix.lower() not in extensions:
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    for old_uuid, new_uuid in self.uuid_mapping.items():
                        content = content.replace(old_uuid, new_uuid)
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        self.log_callback(f"✓ Updated references in: {file_path}")
                        
                except Exception as e:
                    error_msg = f"Error updating references in {file_path}: {str(e)}"
                    self.errors.append(error_msg)
                    self.log_callback(f"✗ {error_msg}")
    
    def create_mcaddon_package(self):
        """Create a .mcaddon package from the updated addon"""
        try:
            version_suffix = f"v{self.main_version}.{self.sub_version}"
            if self.is_beta:
                version_suffix += "-beta"
                
            output_name = f"ADDONS/{self.addon_name}/{self.addon_name} {version_suffix}.mcaddon"
            output_path = Path(output_name)
            
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            if output_path.exists():
                output_path.unlink()
                self.log_callback(f"Removed existing file: {output_name}")
            
            self.log_callback(f"Creating mcaddon package: {output_name}")
            
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(self.base_directory):
                    for file in files:
                        file_path = Path(root) / file
                        arcname = file_path.relative_to(self.base_directory)
                        zipf.write(file_path, arcname)
                        
            file_size = output_path.stat().st_size
            if file_size > 1024 * 1024:
                size_str = f"{file_size / (1024 * 1024):.1f} MB"
            elif file_size > 1024:
                size_str = f"{file_size / 1024:.1f} KB"
            else:
                size_str = f"{file_size} bytes"
            
            self.log_callback(f"✓ Successfully created: {output_name}")
            self.log_callback(f"  └─ Package size: {size_str}")
            
            return str(output_path)
            
        except Exception as e:
            error_msg = f"Error creating mcaddon package: {str(e)}"
            self.errors.append(error_msg)
            self.log_callback(f"✗ {error_msg}")
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
            self.log_callback(f"✗ Error sending Telegram message: {str(e)}")
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
            self.log_callback(f"✗ Error sending Telegram file: {str(e)}")
            return False
    
    def run(self):
        """Run the complete update process"""
        if not self.base_directory:
            self.log_callback("Error: No base directory selected!")
            return
            
        self.log_callback(f"Starting Minecraft manifest update process...")
        self.log_callback(f"Base directory: {self.base_directory.absolute()}")
        self.log_callback(f"Pack type: {self.pack_type}")
        self.log_callback(f"Version: {self.version_format}")
        self.log_callback(f"Beta version: {self.is_beta}")
        
        if self.send_to_telegram:
            self.log_callback(f"Telegram bot enabled - will send to chat ID: {self.chat_id}")
        else:
            self.log_callback("Telegram bot disabled")
        
        self.log_callback("-" * 50)
        
        try:
            if self.send_to_telegram:
                initial_message = f"🔄 *{self.addon_name} Update Started*\n\n📁 Processing directory: `{self.base_directory.name}`\n📦 Pack type: `{self.pack_type}`\n🏷️ Version: `{self.version_format}`\n⏰ Starting update process..."
                self.send_telegram_message(initial_message)
            
            manifest_files = self.find_manifest_files()
            
            if not manifest_files:
                self.log_callback("No manifest.json files found!")
                if self.send_to_telegram:
                    self.send_telegram_message("❌ *Update Failed*\n\nNo manifest.json files found in the directory.")
                return
            
            self.log_callback(f"Found {len(manifest_files)} manifest file(s)")
            
            for manifest_file in manifest_files:
                self.update_manifest_file(manifest_file)
            
            self.log_callback("\nUpdating UUID references in other files...")
            self.update_other_files()
            
            self.log_callback("\nCreating mcaddon package...")
            package_path = self.create_mcaddon_package()
            
            self.log_callback("\n" + "-" * 50)
            self.log_callback("Update Summary:")
            self.log_callback(f"✓ Files updated: {len(self.updated_files)}")
            self.log_callback(f"✓ UUIDs generated: {len(self.uuid_mapping)}")
            self.log_callback(f"✓ Pack type: {self.pack_type}")
            self.log_callback(f"✓ Version: {self.version_format}")
            if package_path:
                self.log_callback(f"✓ McAddon package created: {package_path}")
            self.log_callback(f"✗ Errors: {len(self.errors)}")
            
            if self.send_to_telegram and package_path:
                summary_message = f"✅ *{self.addon_name} Update Complete*\n\n"
                summary_message += f"📊 **Summary:**\n"
                summary_message += f"• Files updated: `{len(self.updated_files)}`\n"
                summary_message += f"• UUIDs generated: `{len(self.uuid_mapping)}`\n"
                summary_message += f"• Pack type: `{self.pack_type}`\n"
                summary_message += f"• Version: `{self.version_format}`\n"
                
                if self.errors:
                    summary_message += f"• Errors: `{len(self.errors)}`\n"
                
                file_size = Path(package_path).stat().st_size
                if file_size > 1024 * 1024:
                    size_str = f"{file_size / (1024 * 1024):.1f} MB"
                elif file_size > 1024:
                    size_str = f"{file_size / 1024:.1f} KB"
                else:
                    size_str = f"{file_size} bytes"
                
                summary_message += f"• Package size: `{size_str}`\n"
                summary_message += f"\n📦 Sending addon file..."
                
                self.send_telegram_message(summary_message)
                
                file_caption = f"📱 *{self.addon_name} {self.version_format}*\n\n🔧 Updated with new UUIDs and version\n📦 Pack type: {self.pack_type}\n💾 Ready to install in Minecraft"
                
                if self.send_telegram_file(package_path, file_caption):
                    self.log_callback("✓ McAddon file sent to Telegram successfully!")
                else:
                    self.log_callback("✗ Failed to send McAddon file to Telegram")
            
            if self.errors:
                self.log_callback("\nErrors:")
                for error in self.errors:
                    self.log_callback(f"  {error}")
                
        except Exception as e:
            self.log_callback(f"Fatal error: {str(e)}")
            if self.send_to_telegram:
                error_message = f"💥 *Fatal Error*\n\n`{str(e)}`\n\nUpdate process failed."
                self.send_telegram_message(error_message)


def main():
    root = tk.Tk()
    app = MinecraftAddonGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()