"""
Minecraft Addon Manager - A comprehensive tool for creating and managing Minecraft addons.

This application provides a GUI interface for:
- Creating and editing manifest.json files
- Packing behavior and resource packs
- Sending packs via Telegram
- Managing configuration settings

Author: Addon Manager Team
Version: 2.0.0
"""

import os
import json
import zipfile
import configparser
import logging
import uuid
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from concurrent.futures import ThreadPoolExecutor
import threading

import requests
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.filechooser import FileChooserListView
from kivy.uix.popup import Popup
from kivy.uix.checkbox import CheckBox
from kivy.uix.spinner import Spinner
from kivy.uix.scrollview import ScrollView
from kivy.core.window import Window
from kivy.uix.progressbar import ProgressBar
from kivy.clock import Clock


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('addon_manager.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class ValidationError(Exception):
    """Custom exception for validation errors."""
    pass


class TelegramError(Exception):
    """Custom exception for Telegram-related errors."""
    pass


class PackingError(Exception):
    """Custom exception for packing-related errors."""
    pass


class ConfigManager:
    """Manages configuration settings for the application."""
    
    def __init__(self, config_file: str = 'addon_config.ini'):
        self.config_file = config_file
        self.config = configparser.ConfigParser()
        self._ensure_config_sections()
    
    def _ensure_config_sections(self) -> None:
        """Ensure required configuration sections exist."""
        required_sections = ['telegram', 'settings', 'paths', 'manifest_defaults']
        for section in required_sections:
            if not self.config.has_section(section):
                self.config.add_section(section)
    
    def load(self) -> bool:
        """Load configuration from file."""
        try:
            if os.path.exists(self.config_file):
                self.config.read(self.config_file)
                logger.info(f"Configuration loaded from {self.config_file}")
                return True
            else:
                logger.warning(f"Configuration file {self.config_file} not found, using defaults")
                return False
        except Exception as e:
            logger.error(f"Failed to load configuration: {e}")
            return False
    
    def save(self) -> bool:
        """Save configuration to file."""
        try:
            with open(self.config_file, 'w') as f:
                self.config.write(f)
            logger.info(f"Configuration saved to {self.config_file}")
            return True
        except Exception as e:
            logger.error(f"Failed to save configuration: {e}")
            return False
    
    def get(self, section: str, key: str, fallback: str = '') -> str:
        """Get configuration value."""
        return self.config.get(section, key, fallback=fallback)
    
    def set(self, section: str, key: str, value: str) -> None:
        """Set configuration value."""
        self.config.set(section, key, value)
    
    def get_boolean(self, section: str, key: str, fallback: bool = False) -> bool:
        """Get boolean configuration value."""
        return self.config.getboolean(section, key, fallback=fallback)


class Validator:
    """Utility class for input validation."""
    
    @staticmethod
    def validate_uuid(uuid_string: str) -> bool:
        """Validate UUID format."""
        try:
            uuid.UUID(uuid_string)
            return True
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_version(version_string: str) -> bool:
        """Validate version format (x.x.x)."""
        pattern = r'^\d+\.\d+\.\d+$'
        return bool(re.match(pattern, version_string))
    
    @staticmethod
    def validate_path(path: str) -> bool:
        """Validate if path exists."""
        return os.path.exists(path) if path else False
    
    @staticmethod
    def validate_telegram_token(token: str) -> bool:
        """Basic validation for Telegram bot token format."""
        pattern = r'^\d+:[A-Za-z0-9_-]+$'
        return bool(re.match(pattern, token))
    
    @staticmethod
    def validate_chat_id(chat_id: str) -> bool:
        """Validate Telegram chat ID."""
        try:
            int(chat_id)
            return True
        except (ValueError, TypeError):
            return False


class ManifestGenerator:
    """Handles manifest.json generation and validation."""
    
    @staticmethod
    def generate_manifest(data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a manifest dictionary from input data."""
        try:
            version_parts = [int(x) for x in data['version'].split('.')]
            
            manifest = {
                "format_version": 2,
                "header": {
                    "name": data['name'],
                    "description": data['description'],
                    "uuid": data['header_uuid'],
                    "version": version_parts,
                    "min_engine_version": [1, 19, 0]
                },
                "modules": [
                    {
                        "type": data['pack_type'],
                        "uuid": data['module_uuid'],
                        "version": version_parts
                    }
                ]
            }
            
            # Add dependencies if enabled
            if data.get('enable_dependencies') and data.get('dependency_uuid'):
                dep_version_parts = [int(x) for x in data['dependency_version'].split('.')]
                manifest["dependencies"] = [
                    {
                        "uuid": data['dependency_uuid'],
                        "version": dep_version_parts
                    }
                ]
            
            return manifest
            
        except Exception as e:
            raise ValidationError(f"Failed to generate manifest: {e}")
    
    @staticmethod
    def validate_manifest_data(data: Dict[str, Any]) -> List[str]:
        """Validate manifest data and return list of errors."""
        errors = []
        
        required_fields = ['name', 'description', 'version', 'header_uuid', 'module_uuid']
        for field in required_fields:
            if not data.get(field):
                errors.append(f"Missing required field: {field}")
        
        if data.get('version') and not Validator.validate_version(data['version']):
            errors.append("Invalid version format. Use x.x.x format")
        
        if data.get('header_uuid') and not Validator.validate_uuid(data['header_uuid']):
            errors.append("Invalid header UUID format")
        
        if data.get('module_uuid') and not Validator.validate_uuid(data['module_uuid']):
            errors.append("Invalid module UUID format")
        
        if data.get('enable_dependencies'):
            if not data.get('dependency_uuid'):
                errors.append("Dependency UUID required when dependencies are enabled")
            elif not Validator.validate_uuid(data['dependency_uuid']):
                errors.append("Invalid dependency UUID format")
            
            if not data.get('dependency_version'):
                errors.append("Dependency version required when dependencies are enabled")
            elif not Validator.validate_version(data['dependency_version']):
                errors.append("Invalid dependency version format")
        
        return errors


class PackManager:
    """Handles pack compression and file operations."""
    
    def __init__(self, progress_callback=None, status_callback=None):
        self.progress_callback = progress_callback
        self.status_callback = status_callback
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def compress_folder(self, folder_path: str, output_path: str, pack_name: str) -> str:
        """Compress a folder into a .mcpack file with progress tracking."""
        if not os.path.exists(folder_path):
            raise PackingError(f"Source folder does not exist: {folder_path}")
        
        os.makedirs(output_path, exist_ok=True)
        zip_path = os.path.join(output_path, f"{pack_name}.mcpack")
        
        try:
            # Count total files for progress tracking
            total_files = sum(len(files) for _, _, files in os.walk(folder_path))
            processed_files = 0
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
                for root, dirs, files in os.walk(folder_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_name = os.path.relpath(file_path, folder_path)
                        
                        # Skip temporary and hidden files
                        if file.startswith('.') or file.endswith('.tmp'):
                            continue
                        
                        zipf.write(file_path, arc_name)
                        processed_files += 1
                        
                        # Update progress
                        if self.progress_callback and total_files > 0:
                            progress = (processed_files / total_files) * 100
                            Clock.schedule_once(lambda dt: self.progress_callback(progress))
            
            file_size = os.path.getsize(zip_path)
            logger.info(f"Successfully created pack: {zip_path} ({file_size / 1024 / 1024:.2f} MB)")
            return zip_path
            
        except Exception as e:
            if os.path.exists(zip_path):
                os.remove(zip_path)
            raise PackingError(f"Compression failed: {e}")
    
    def pack_async(self, pack_data: Dict[str, Any], callback=None):
        """Pack files asynchronously."""
        def _pack():
            try:
                result = self._pack_sync(pack_data)
                if callback:
                    Clock.schedule_once(lambda dt: callback(True, result))
            except Exception as e:
                logger.error(f"Async packing failed: {e}")
                if callback:
                    Clock.schedule_once(lambda dt: callback(False, str(e)))
        
        self.executor.submit(_pack)
    
    def _pack_sync(self, pack_data: Dict[str, Any]) -> List[str]:
        """Synchronous packing implementation."""
        packed_files = []
        
        if self.status_callback:
            Clock.schedule_once(lambda dt: self.status_callback("Starting compression..."))
        
        if pack_data.get('pack_behavior') and pack_data.get('bp_path'):
            if self.status_callback:
                Clock.schedule_once(lambda dt: self.status_callback("Compressing behavior pack..."))
            
            bp_name = Path(pack_data['bp_path']).name
            bp_file = self.compress_folder(
                pack_data['bp_path'], 
                pack_data['output_path'], 
                f"{bp_name}_BP"
            )
            packed_files.append(bp_file)
        
        if pack_data.get('pack_resource') and pack_data.get('rp_path'):
            if self.status_callback:
                Clock.schedule_once(lambda dt: self.status_callback("Compressing resource pack..."))
            
            rp_name = Path(pack_data['rp_path']).name
            rp_file = self.compress_folder(
                pack_data['rp_path'], 
                pack_data['output_path'], 
                f"{rp_name}_RP"
            )
            packed_files.append(rp_file)
        
        if self.status_callback:
            Clock.schedule_once(lambda dt: self.status_callback(f"Completed! {len(packed_files)} pack(s) created"))
        
        return packed_files


class TelegramBot:
    """Handles Telegram bot operations."""
    
    def __init__(self, token: str, chat_id: str):
        self.token = token
        self.chat_id = chat_id
        self.base_url = f"https://api.telegram.org/bot{token}"
        self._validate_credentials()
    
    def _validate_credentials(self) -> None:
        """Validate bot credentials."""
        if not Validator.validate_telegram_token(self.token):
            raise TelegramError("Invalid bot token format")
        
        if not Validator.validate_chat_id(self.chat_id):
            raise TelegramError("Invalid chat ID format")
    
    def test_connection(self, timeout: int = 10) -> Dict[str, Any]:
        """Test bot connection and return bot information."""
        try:
            url = f"{self.base_url}/getMe"
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            
            data = response.json()
            if not data.get('ok'):
                raise TelegramError("Bot token is invalid")
            
            return data['result']
            
        except requests.exceptions.RequestException as e:
            raise TelegramError(f"Connection failed: {e}")
        except Exception as e:
            raise TelegramError(f"Unexpected error: {e}")
    
    def send_message(self, message: str, timeout: int = 30) -> bool:
        """Send a text message."""
        try:
            url = f"{self.base_url}/sendMessage"
            data = {
                'chat_id': self.chat_id,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, data=data, timeout=timeout)
            response.raise_for_status()
            
            result = response.json()
            return result.get('ok', False)
            
        except Exception as e:
            raise TelegramError(f"Failed to send message: {e}")
    
    def send_document(self, file_path: str, caption: str = "", timeout: int = 120) -> bool:
        """Send a document file."""
        if not os.path.exists(file_path):
            raise TelegramError(f"File not found: {file_path}")
        
        file_size = os.path.getsize(file_path)
        if file_size > 50 * 1024 * 1024:  # 50MB limit
            raise TelegramError("File too large (max 50MB)")
        
        try:
            url = f"{self.base_url}/sendDocument"
            
            with open(file_path, 'rb') as f:
                files = {'document': f}
                data = {
                    'chat_id': self.chat_id,
                    'caption': caption
                }
                
                response = requests.post(url, data=data, files=files, timeout=timeout)
                response.raise_for_status()
                
                result = response.json()
                return result.get('ok', False)
                
        except Exception as e:
            raise TelegramError(f"Failed to send document: {e}")


class MinecraftAddonManager(BoxLayout):
    """Main application class for the Minecraft Addon Manager."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10
        
        # Initialize components
        self.config_manager = ConfigManager()
        self.config_manager.load()
        
        self.pack_manager = PackManager(
            progress_callback=self._update_progress,
            status_callback=self._update_status
        )
        
        self.last_packed_files: List[str] = []
        
        # Window setup
        Window.size = (1000, 800)
        Window.title = "Minecraft Addon Manager v2.0"
        
        # UI components will be set during build_ui
        self.progress = None
        self.status_label = None
        
        self.build_ui()
        self._load_ui_config()
        
        logger.info("Minecraft Addon Manager initialized")
    
    def _update_progress(self, value: float) -> None:
        """Update progress bar value."""
        if self.progress:
            self.progress.value = value
    
    def _update_status(self, text: str) -> None:
        """Update status label text."""
        if self.status_label:
            self.status_label.text = text
    
    def build_ui(self):
        """Build the user interface."""
        # Create tabbed interface
        tab_panel = TabbedPanel()
        tab_panel.do_default_tab = False
        
        # Manifest Tab
        manifest_tab = TabbedPanelItem(text='Manifest Editor')
        manifest_tab.content = self.create_manifest_tab()
        tab_panel.add_widget(manifest_tab)
        
        # Packing Tab
        packing_tab = TabbedPanelItem(text='Pack & Compress')
        packing_tab.content = self.create_packing_tab()
        tab_panel.add_widget(packing_tab)
        
        # Telegram Tab
        telegram_tab = TabbedPanelItem(text='Telegram Bot')
        telegram_tab.content = self.create_telegram_tab()
        tab_panel.add_widget(telegram_tab)
        
        # Config Tab
        config_tab = TabbedPanelItem(text='Settings')
        config_tab.content = self.create_config_tab()
        tab_panel.add_widget(config_tab)
        
        self.add_widget(tab_panel)
    
    def create_manifest_tab(self):
        """Create the manifest editing tab."""
        layout = ScrollView()
        content = BoxLayout(orientation='vertical', spacing=10, size_hint_y=None)
        content.bind(minimum_height=content.setter('height'))
        
        # Header
        header = Label(
            text='[size=18][b]Manifest Editor[/b][/size]\nCreate and edit manifest.json files for your Minecraft addons',
            markup=True,
            size_hint_y=None,
            height=60,
            halign='center'
        )
        content.add_widget(header)
        
        # Manifest form
        form_layout = GridLayout(cols=2, spacing=10, size_hint_y=None, height=700)
        
        # Basic Info Section
        form_layout.add_widget(Label(text='[b]Pack Name:[/b]', markup=True, size_hint_y=None, height=40))
        self.name_input = TextInput(
            multiline=False, 
            size_hint_y=None, 
            height=40,
            hint_text='Enter pack name (required)'
        )
        form_layout.add_widget(self.name_input)
        
        form_layout.add_widget(Label(text='[b]Description:[/b]', markup=True, size_hint_y=None, height=40))
        self.desc_input = TextInput(
            multiline=True, 
            size_hint_y=None, 
            height=80,
            hint_text='Enter pack description (required)'
        )
        form_layout.add_widget(self.desc_input)
        
        # Version
        form_layout.add_widget(Label(text='[b]Version (x.x.x):[/b]', markup=True, size_hint_y=None, height=40))
        self.version_input = TextInput(
            text='1.0.0', 
            multiline=False, 
            size_hint_y=None, 
            height=40,
            hint_text='Format: 1.0.0'
        )
        form_layout.add_widget(self.version_input)
        
        # UUID fields with better layout
        form_layout.add_widget(Label(text='[b]Header UUID:[/b]', markup=True, size_hint_y=None, height=40))
        uuid_layout1 = BoxLayout(size_hint_y=None, height=40)
        self.header_uuid = TextInput(multiline=False, hint_text='Auto-generated UUID')
        uuid_btn1 = Button(text='Generate', size_hint_x=None, width=100)
        uuid_btn1.bind(on_press=lambda x: self.generate_uuid(self.header_uuid))
        uuid_layout1.add_widget(self.header_uuid)
        uuid_layout1.add_widget(uuid_btn1)
        form_layout.add_widget(uuid_layout1)
        
        form_layout.add_widget(Label(text='[b]Module UUID:[/b]', markup=True, size_hint_y=None, height=40))
        uuid_layout2 = BoxLayout(size_hint_y=None, height=40)
        self.module_uuid = TextInput(multiline=False, hint_text='Auto-generated UUID')
        uuid_btn2 = Button(text='Generate', size_hint_x=None, width=100)
        uuid_btn2.bind(on_press=lambda x: self.generate_uuid(self.module_uuid))
        uuid_layout2.add_widget(self.module_uuid)
        uuid_layout2.add_widget(uuid_btn2)
        form_layout.add_widget(uuid_layout2)
        
        # Pack Type
        form_layout.add_widget(Label(text='[b]Pack Type:[/b]', markup=True, size_hint_y=None, height=40))
        self.pack_type = Spinner(
            text='resources',
            values=['resources', 'data'],
            size_hint_y=None, 
            height=40
        )
        form_layout.add_widget(self.pack_type)
        
        # Dependencies Section
        form_layout.add_widget(Label(text='[b]Enable Dependencies:[/b]', markup=True, size_hint_y=None, height=40))
        self.enable_deps = CheckBox(size_hint_y=None, height=40)
        form_layout.add_widget(self.enable_deps)
        
        form_layout.add_widget(Label(text='[b]Dependency UUID:[/b]', markup=True, size_hint_y=None, height=40))
        uuid_layout3 = BoxLayout(size_hint_y=None, height=40)
        self.dep_uuid = TextInput(multiline=False, hint_text='Optional dependency UUID')
        uuid_btn3 = Button(text='Generate', size_hint_x=None, width=100)
        uuid_btn3.bind(on_press=lambda x: self.generate_uuid(self.dep_uuid))
        uuid_layout3.add_widget(self.dep_uuid)
        uuid_layout3.add_widget(uuid_btn3)
        form_layout.add_widget(uuid_layout3)
        
        form_layout.add_widget(Label(text='[b]Dependency Version:[/b]', markup=True, size_hint_y=None, height=40))
        self.dep_version = TextInput(
            text='1.0.0', 
            multiline=False, 
            size_hint_y=None, 
            height=40,
            hint_text='Dependency version'
        )
        form_layout.add_widget(self.dep_version)
        
        content.add_widget(form_layout)
        
        # Validation status
        self.validation_label = Label(
            text='Fill in the required fields to validate',
            size_hint_y=None,
            height=40,
            color=(0.7, 0.7, 0.7, 1)
        )
        content.add_widget(self.validation_label)
        
        # Buttons
        btn_layout = BoxLayout(size_hint_y=None, height=60, spacing=10)
        
        validate_btn = Button(text='Validate', background_color=(0.2, 0.6, 1, 1))
        validate_btn.bind(on_press=self.validate_manifest_data)
        btn_layout.add_widget(validate_btn)
        
        load_btn = Button(text='Load Manifest', background_color=(0.2, 0.8, 0.2, 1))
        load_btn.bind(on_press=self.load_manifest)
        btn_layout.add_widget(load_btn)
        
        save_btn = Button(text='Save Manifest', background_color=(0.8, 0.6, 0.2, 1))
        save_btn.bind(on_press=self.save_manifest)
        btn_layout.add_widget(save_btn)
        
        generate_btn = Button(text='Generate & Export', background_color=(0.8, 0.2, 0.2, 1))
        generate_btn.bind(on_press=self.generate_manifest)
        btn_layout.add_widget(generate_btn)
        
        content.add_widget(btn_layout)
        layout.add_widget(content)
        return layout
    
    def create_packing_tab(self):
        """Create the packing and compression tab."""
        layout = BoxLayout(orientation='vertical', spacing=15, padding=15)
        
        # Header
        header = Label(
            text='[size=18][b]Pack & Compress[/b][/size]\nCompress your addon folders into .mcpack files',
            markup=True,
            size_hint_y=None,
            height=60,
            halign='center'
        )
        layout.add_widget(header)
        
        # File selection
        file_layout = GridLayout(cols=2, size_hint_y=None, height=160, spacing=10)
        
        file_layout.add_widget(Label(text='[b]Behavior Pack Folder:[/b]', markup=True))
        bp_layout = BoxLayout()
        self.bp_path = TextInput(multiline=False, hint_text='Select behavior pack folder')
        bp_btn = Button(text='Browse', size_hint_x=None, width=100)
        bp_btn.bind(on_press=lambda x: self.browse_folder('bp'))
        bp_layout.add_widget(self.bp_path)
        bp_layout.add_widget(bp_btn)
        file_layout.add_widget(bp_layout)
        
        file_layout.add_widget(Label(text='[b]Resource Pack Folder:[/b]', markup=True))
        rp_layout = BoxLayout()
        self.rp_path = TextInput(multiline=False, hint_text='Select resource pack folder')
        rp_btn = Button(text='Browse', size_hint_x=None, width=100)
        rp_btn.bind(on_press=lambda x: self.browse_folder('rp'))
        rp_layout.add_widget(self.rp_path)
        rp_layout.add_widget(rp_btn)
        file_layout.add_widget(rp_layout)
        
        file_layout.add_widget(Label(text='[b]Output Directory:[/b]', markup=True))
        out_layout = BoxLayout()
        self.output_path = TextInput(multiline=False, hint_text='Select output directory')
        out_btn = Button(text='Browse', size_hint_x=None, width=100)
        out_btn.bind(on_press=lambda x: self.browse_folder('output'))
        out_layout.add_widget(self.output_path)
        out_layout.add_widget(out_btn)
        file_layout.add_widget(out_layout)
        
        layout.add_widget(file_layout)
        
        # Options
        options_layout = GridLayout(cols=4, size_hint_y=None, height=60, spacing=20)
        
        options_layout.add_widget(Label(text='[b]Compress Behavior Pack:[/b]', markup=True))
        self.compress_bp = CheckBox(active=True)
        options_layout.add_widget(self.compress_bp)
        
        options_layout.add_widget(Label(text='[b]Compress Resource Pack:[/b]', markup=True))
        self.compress_rp = CheckBox(active=True)
        options_layout.add_widget(self.compress_rp)
        
        layout.add_widget(options_layout)
        
        # Progress and status
        progress_layout = BoxLayout(orientation='vertical', size_hint_y=None, height=80, spacing=5)
        
        self.progress = ProgressBar(max=100, size_hint_y=None, height=25)
        progress_layout.add_widget(self.progress)
        
        self.status_label = Label(
            text='Ready to pack', 
            size_hint_y=None, 
            height=30,
            color=(0.7, 0.7, 0.7, 1)
        )
        progress_layout.add_widget(self.status_label)
        
        layout.add_widget(progress_layout)
        
        # Pack buttons
        pack_layout = BoxLayout(size_hint_y=None, height=60, spacing=15)
        
        pack_bp_btn = Button(text='Pack Behavior Only', background_color=(0.2, 0.6, 1, 1))
        pack_bp_btn.bind(on_press=self.pack_behavior)
        pack_layout.add_widget(pack_bp_btn)
        
        pack_rp_btn = Button(text='Pack Resource Only', background_color=(0.6, 0.2, 1, 1))
        pack_rp_btn.bind(on_press=self.pack_resource)
        pack_layout.add_widget(pack_rp_btn)
        
        pack_both_btn = Button(text='Pack Both', background_color=(0.2, 0.8, 0.2, 1))
        pack_both_btn.bind(on_press=self.pack_both)
        pack_layout.add_widget(pack_both_btn)
        
        layout.add_widget(pack_layout)
        
        return layout
    
    def create_telegram_tab(self):
        """Create the Telegram bot tab."""
        layout = BoxLayout(orientation='vertical', spacing=15, padding=15)
        
        # Header
        header = Label(
            text='[size=18][b]Telegram Bot[/b][/size]\nSend your packed files via Telegram bot',
            markup=True,
            size_hint_y=None,
            height=60,
            halign='center'
        )
        layout.add_widget(header)
        
        # Telegram settings
        tg_layout = GridLayout(cols=2, size_hint_y=None, height=160, spacing=10)
        
        tg_layout.add_widget(Label(text='[b]Bot Token:[/b]', markup=True))
        self.bot_token = TextInput(
            multiline=False, 
            password=True,
            hint_text='Get from @BotFather on Telegram'
        )
        tg_layout.add_widget(self.bot_token)
        
        tg_layout.add_widget(Label(text='[b]Chat ID:[/b]', markup=True))
        self.chat_id = TextInput(
            multiline=False,
            hint_text='Your chat ID or channel ID'
        )
        tg_layout.add_widget(self.chat_id)
        
        tg_layout.add_widget(Label(text='[b]Message:[/b]', markup=True))
        self.tg_message = TextInput(
            text='🎮 New Minecraft addon pack ready!', 
            multiline=True,
            hint_text='Message to send with files'
        )
        tg_layout.add_widget(self.tg_message)
        
        layout.add_widget(tg_layout)
        
        # File selection for sending
        file_select_layout = GridLayout(cols=4, size_hint_y=None, height=60, spacing=15)
        file_select_layout.add_widget(Label(text='[b]Files to send:[/b]', markup=True))
        
        self.send_bp = CheckBox(active=True)
        file_select_layout.add_widget(Label(text='Behavior Pack'))
        file_select_layout.add_widget(self.send_bp)
        
        self.send_rp = CheckBox(active=True)
        file_select_layout.add_widget(Label(text='Resource Pack'))
        file_select_layout.add_widget(self.send_rp)
        
        layout.add_widget(file_select_layout)
        
        # Connection status
        self.tg_status = Label(
            text='Not connected', 
            size_hint_y=None, 
            height=40,
            color=(1, 0.5, 0.5, 1)
        )
        layout.add_widget(self.tg_status)
        
        # Send buttons
        send_layout = BoxLayout(size_hint_y=None, height=60, spacing=15)
        
        test_btn = Button(text='Test Connection', background_color=(0.2, 0.6, 1, 1))
        test_btn.bind(on_press=self.test_telegram)
        send_layout.add_widget(test_btn)
        
        send_btn = Button(text='Send to Telegram', background_color=(0.2, 0.8, 0.2, 1))
        send_btn.bind(on_press=self.send_to_telegram)
        send_layout.add_widget(send_btn)
        
        layout.add_widget(send_layout)
        
        return layout
    
    def create_config_tab(self):
        """Create the configuration tab."""
        layout = BoxLayout(orientation='vertical', spacing=15, padding=15)
        
        # Header
        header = Label(
            text='[size=18][b]Settings[/b][/size]\nConfigure application preferences and defaults',
            markup=True,
            size_hint_y=None,
            height=60,
            halign='center'
        )
        layout.add_widget(header)
        
        config_layout = GridLayout(cols=2, spacing=10, size_hint_y=None, height=280)
        
        # General Settings
        config_layout.add_widget(Label(text='[b]Auto-save Config:[/b]', markup=True))
        self.auto_save = CheckBox()
        config_layout.add_widget(self.auto_save)
        
        config_layout.add_widget(Label(text='[b]Default Output Path:[/b]', markup=True))
        self.default_output = TextInput(
            multiline=False,
            hint_text='Default directory for output files'
        )
        config_layout.add_widget(self.default_output)
        
        config_layout.add_widget(Label(text='[b]Default Author:[/b]', markup=True))
        self.default_author = TextInput(
            multiline=False,
            hint_text='Your name for manifest files'
        )
        config_layout.add_widget(self.default_author)
        
        # Manifest Defaults
        config_layout.add_widget(Label(text='[b]Default Pack Type:[/b]', markup=True))
        self.default_pack_type = Spinner(
            text='resources',
            values=['resources', 'data'],
            size_hint_y=None,
            height=40
        )
        config_layout.add_widget(self.default_pack_type)
        
        config_layout.add_widget(Label(text='[b]Default Version:[/b]', markup=True))
        self.default_version = TextInput(
            text='1.0.0',
            multiline=False,
            hint_text='Default version for new packs'
        )
        config_layout.add_widget(self.default_version)
        
        config_layout.add_widget(Label(text='[b]Log Level:[/b]', markup=True))
        self.log_level = Spinner(
            text='INFO',
            values=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
            size_hint_y=None,
            height=40
        )
        config_layout.add_widget(self.log_level)
        
        layout.add_widget(config_layout)
        
        # Config buttons
        btn_layout = BoxLayout(size_hint_y=None, height=60, spacing=15)
        
        load_config_btn = Button(text='Load Config', background_color=(0.2, 0.6, 1, 1))
        load_config_btn.bind(on_press=self.load_config_manual)
        btn_layout.add_widget(load_config_btn)
        
        save_config_btn = Button(text='Save Config', background_color=(0.2, 0.8, 0.2, 1))
        save_config_btn.bind(on_press=self.save_config_manual)
        btn_layout.add_widget(save_config_btn)
        
        reset_btn = Button(text='Reset to Defaults', background_color=(0.8, 0.6, 0.2, 1))
        reset_btn.bind(on_press=self.reset_config)
        btn_layout.add_widget(reset_btn)
        
        layout.add_widget(btn_layout)
        
        # About section
        about_text = (
            '[b]Minecraft Addon Manager v2.0[/b]\n'
            'A comprehensive tool for creating and managing Minecraft addons.\n\n'
            'Features:\n'
            '• Manifest.json editor with validation\n'
            '• Pack compression with progress tracking\n'
            '• Telegram bot integration\n'
            '• Configuration management\n'
            '• Enhanced error handling\n\n'
            '[i]Logs are saved to addon_manager.log[/i]'
        )
        
        about_label = Label(
            text=about_text,
            markup=True,
            size_hint_y=None,
            height=200,
            text_size=(None, None),
            halign='left',
            valign='top'
        )
        layout.add_widget(about_label)
        
        return layout
    
    def _load_ui_config(self) -> None:
        """Load configuration values into UI components."""
        try:
            # Telegram settings
            self.bot_token.text = self.config_manager.get('telegram', 'bot_token')
            self.chat_id.text = self.config_manager.get('telegram', 'chat_id')
            
            # General settings
            self.auto_save.active = self.config_manager.get_boolean('settings', 'auto_save', True)
            self.default_output.text = self.config_manager.get('settings', 'default_output')
            self.default_author.text = self.config_manager.get('settings', 'default_author')
            
            # Set output path if default is configured
            if self.default_output.text and not self.output_path.text:
                self.output_path.text = self.default_output.text
                
            logger.info("UI configuration loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load UI configuration: {e}")
    
    def generate_uuid(self, text_input: TextInput) -> None:
        """Generate a new UUID and set it in the text input."""
        try:
            new_uuid = str(uuid.uuid4())
            text_input.text = new_uuid
            logger.debug(f"Generated UUID: {new_uuid}")
        except Exception as e:
            logger.error(f"Failed to generate UUID: {e}")
            self.show_popup('Error', f'Failed to generate UUID: {e}')
    
    def browse_folder(self, folder_type: str) -> None:
        """Open folder browser dialog."""
        def on_selection(instance, selection):
            if selection:
                selected_path = selection[0]
                if folder_type == 'bp':
                    self.bp_path.text = selected_path
                elif folder_type == 'rp':
                    self.rp_path.text = selected_path
                elif folder_type == 'output':
                    self.output_path.text = selected_path
                
                logger.debug(f"Selected {folder_type} path: {selected_path}")
                
                # Save to config if it's output path
                if folder_type == 'output' and self.auto_save.active:
                    self.config_manager.set('settings', 'default_output', selected_path)
                    self.config_manager.save()
            
            popup.dismiss()
        
        content = BoxLayout(orientation='vertical', spacing=10)
        filechooser = FileChooserListView(dirselect=True)
        filechooser.bind(on_submit=on_selection)
        
        content.add_widget(filechooser)
        
        btn_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        select_btn = Button(text='Select', background_color=(0.2, 0.8, 0.2, 1))
        select_btn.bind(on_press=lambda x: on_selection(filechooser, filechooser.selection))
        cancel_btn = Button(text='Cancel', background_color=(0.8, 0.2, 0.2, 1))
        
        btn_layout.add_widget(select_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(
            title=f'Select {folder_type.upper()} Folder', 
            content=content, 
            size_hint=(0.8, 0.8)
        )
        cancel_btn.bind(on_press=popup.dismiss)
        popup.open()
    
    def validate_manifest_data(self, instance=None) -> None:
        """Validate current manifest data and show results."""
        try:
            data = self._collect_manifest_data()
            errors = ManifestGenerator.validate_manifest_data(data)
            
            if errors:
                error_text = '\n'.join([f"• {error}" for error in errors])
                self.validation_label.text = f"Validation Failed:\n{error_text}"
                self.validation_label.color = (1, 0.5, 0.5, 1)
                self.show_popup('Validation Errors', error_text)
            else:
                self.validation_label.text = "✓ All fields are valid!"
                self.validation_label.color = (0.5, 1, 0.5, 1)
                self.show_popup('Success', 'All manifest data is valid!')
                
        except Exception as e:
            logger.error(f"Validation error: {e}")
            self.show_popup('Error', f'Validation failed: {e}')
    
    def _collect_manifest_data(self) -> Dict[str, Any]:
        """Collect manifest data from UI components."""
        return {
            'name': self.name_input.text.strip(),
            'description': self.desc_input.text.strip(),
            'version': self.version_input.text.strip(),
            'header_uuid': self.header_uuid.text.strip(),
            'module_uuid': self.module_uuid.text.strip(),
            'pack_type': self.pack_type.text,
            'enable_dependencies': self.enable_deps.active,
            'dependency_uuid': self.dep_uuid.text.strip(),
            'dependency_version': self.dep_version.text.strip()
        }
    
    def generate_manifest(self, instance) -> None:
        """Generate and save manifest.json file."""
        try:
            data = self._collect_manifest_data()
            
            # Validate first
            errors = ManifestGenerator.validate_manifest_data(data)
            if errors:
                error_text = '\n'.join(errors)
                self.show_popup('Validation Error', f'Please fix these errors:\n{error_text}')
                return
            
            # Generate manifest
            manifest = ManifestGenerator.generate_manifest(data)
            
            # Save to file
            output_dir = self.output_path.text if self.output_path.text else os.getcwd()
            os.makedirs(output_dir, exist_ok=True)
            
            manifest_path = os.path.join(output_dir, 'manifest.json')
            
            with open(manifest_path, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Manifest generated and saved to: {manifest_path}")
            self.show_popup('Success', f'Manifest saved to:\n{manifest_path}')
            
            # Auto-save config if enabled
            if self.auto_save.active:
                self.save_config()
                
        except ValidationError as e:
            logger.error(f"Manifest validation error: {e}")
            self.show_popup('Validation Error', str(e))
        except Exception as e:
            logger.error(f"Failed to generate manifest: {e}")
            self.show_popup('Error', f'Failed to generate manifest:\n{e}')
    
    def load_manifest(self, instance) -> None:
        """Load manifest from file."""
        def on_selection(instance, selection):
            if selection:
                try:
                    manifest_path = selection[0]
                    with open(manifest_path, 'r', encoding='utf-8') as f:
                        manifest = json.load(f)
                    
                    # Load data into form
                    header = manifest.get('header', {})
                    self.name_input.text = header.get('name', '')
                    self.desc_input.text = header.get('description', '')
                    self.header_uuid.text = header.get('uuid', '')
                    
                    version = header.get('version', [1, 0, 0])
                    self.version_input.text = '.'.join(map(str, version))
                    
                    modules = manifest.get('modules', [])
                    if modules:
                        module = modules[0]
                        self.module_uuid.text = module.get('uuid', '')
                        self.pack_type.text = module.get('type', 'resources')
                    
                    dependencies = manifest.get('dependencies', [])
                    if dependencies:
                        dep = dependencies[0]
                        self.dep_uuid.text = dep.get('uuid', '')
                        dep_version = dep.get('version', [1, 0, 0])
                        self.dep_version.text = '.'.join(map(str, dep_version))
                        self.enable_deps.active = True
                    else:
                        self.enable_deps.active = False
                    
                    logger.info(f"Manifest loaded from: {manifest_path}")
                    self.show_popup('Success', f'Manifest loaded from:\n{os.path.basename(manifest_path)}')
                    
                except json.JSONDecodeError as e:
                    logger.error(f"Invalid JSON in manifest file: {e}")
                    self.show_popup('Error', 'Invalid JSON format in manifest file')
                except Exception as e:
                    logger.error(f"Failed to load manifest: {e}")
                    self.show_popup('Error', f'Failed to load manifest:\n{e}')
            
            popup.dismiss()
        
        content = BoxLayout(orientation='vertical', spacing=10)
        filechooser = FileChooserListView(filters=['*.json'])
        filechooser.bind(on_submit=on_selection)
        
        content.add_widget(filechooser)
        
        btn_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        select_btn = Button(text='Load', background_color=(0.2, 0.8, 0.2, 1))
        select_btn.bind(on_press=lambda x: on_selection(filechooser, filechooser.selection))
        cancel_btn = Button(text='Cancel', background_color=(0.8, 0.2, 0.2, 1))
        
        btn_layout.add_widget(select_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(title='Load Manifest', content=content, size_hint=(0.8, 0.8))
        cancel_btn.bind(on_press=popup.dismiss)
        popup.open()
    
    def save_manifest(self, instance) -> None:
        """Save manifest (alias for generate_manifest)."""
        self.generate_manifest(instance)
    
    def pack_behavior(self, instance) -> None:
        """Pack behavior pack only."""
        if not self.bp_path.text or not Validator.validate_path(self.bp_path.text):
            self.show_popup('Error', 'Please select a valid behavior pack folder')
            return
        
        self._pack_async('behavior')
    
    def pack_resource(self, instance) -> None:
        """Pack resource pack only."""
        if not self.rp_path.text or not Validator.validate_path(self.rp_path.text):
            self.show_popup('Error', 'Please select a valid resource pack folder')
            return
        
        self._pack_async('resource')
    
    def pack_both(self, instance) -> None:
        """Pack both behavior and resource packs."""
        bp_valid = self.bp_path.text and Validator.validate_path(self.bp_path.text)
        rp_valid = self.rp_path.text and Validator.validate_path(self.rp_path.text)
        
        if not bp_valid and not rp_valid:
            self.show_popup('Error', 'Please select valid pack folders')
            return
        elif not bp_valid:
            self.show_popup('Error', 'Invalid behavior pack folder')
            return
        elif not rp_valid:
            self.show_popup('Error', 'Invalid resource pack folder')
            return
        
        self._pack_async('both')
    
    def _pack_async(self, pack_type: str) -> None:
        """Pack files asynchronously."""
        try:
            output_dir = self.output_path.text if self.output_path.text else os.getcwd()
            
            pack_data = {
                'pack_behavior': pack_type in ['behavior', 'both'] and self.compress_bp.active,
                'pack_resource': pack_type in ['resource', 'both'] and self.compress_rp.active,
                'bp_path': self.bp_path.text,
                'rp_path': self.rp_path.text,
                'output_path': output_dir
            }
            
            # Reset progress
            self.progress.value = 0
            
            # Start async packing
            self.pack_manager.pack_async(pack_data, self._on_pack_complete)
            
            logger.info(f"Started packing: {pack_type}")
            
        except Exception as e:
            logger.error(f"Failed to start packing: {e}")
            self.show_popup('Error', f'Failed to start packing: {e}')
    
    def _on_pack_complete(self, success: bool, result) -> None:
        """Handle pack completion callback."""
        if success:
            self.last_packed_files = result
            self.progress.value = 100
            
            file_list = '\n'.join([os.path.basename(f) for f in result])
            logger.info(f"Packing completed successfully: {len(result)} files")
            self.show_popup('Success', f'Packing completed!\n\nFiles created:\n{file_list}')
            
            # Auto-save config if enabled
            if self.auto_save.active:
                self.save_config()
        else:
            self.progress.value = 0
            self.status_label.text = 'Packing failed'
            logger.error(f"Packing failed: {result}")
            self.show_popup('Error', f'Packing failed:\n{result}')
    
    def test_telegram(self, instance) -> None:
        """Test Telegram bot connection."""
        if not self.bot_token.text or not self.chat_id.text:
            self.show_popup('Error', 'Please enter both bot token and chat ID')
            return
        
        def _test():
            try:
                bot = TelegramBot(self.bot_token.text, self.chat_id.text)
                bot_info = bot.test_connection()
                
                success_msg = f"✓ Connected to bot: {bot_info.get('first_name', 'Unknown')}"
                Clock.schedule_once(lambda dt: self._update_telegram_status(success_msg, True))
                Clock.schedule_once(lambda dt: self.show_popup('Success', 'Telegram connection successful!'))
                
                logger.info(f"Telegram connection test successful: {bot_info}")
                
            except TelegramError as e:
                error_msg = f"✗ Connection failed"
                Clock.schedule_once(lambda dt: self._update_telegram_status(error_msg, False))
                Clock.schedule_once(lambda dt: self.show_popup('Connection Error', str(e)))
                logger.error(f"Telegram connection test failed: {e}")
            except Exception as e:
                error_msg = f"✗ Unexpected error"
                Clock.schedule_once(lambda dt: self._update_telegram_status(error_msg, False))
                Clock.schedule_once(lambda dt: self.show_popup('Error', f'Unexpected error: {e}'))
                logger.error(f"Telegram test unexpected error: {e}")
        
        # Run test in background thread
        threading.Thread(target=_test, daemon=True).start()
        self.tg_status.text = "Testing connection..."
        self.tg_status.color = (1, 1, 0.5, 1)
    
    def _update_telegram_status(self, message: str, success: bool) -> None:
        """Update Telegram status label."""
        self.tg_status.text = message
        self.tg_status.color = (0.5, 1, 0.5, 1) if success else (1, 0.5, 0.5, 1)
    
    def send_to_telegram(self, instance) -> None:
        """Send packed files to Telegram."""
        if not hasattr(self, 'last_packed_files') or not self.last_packed_files:
            self.show_popup('Error', 'No packed files available. Pack some files first.')
            return
        
        if not self.bot_token.text or not self.chat_id.text:
            self.show_popup('Error', 'Please enter bot token and chat ID')
            return
        
        def _send():
            try:
                bot = TelegramBot(self.bot_token.text, self.chat_id.text)
                
                # Collect files to send
                files_to_send = []
                for file_path in self.last_packed_files:
                    if ('_BP' in file_path and self.send_bp.active) or \
                       ('_RP' in file_path and self.send_rp.active):
                        if os.path.exists(file_path):
                            files_to_send.append(file_path)
                
                if not files_to_send:
                    Clock.schedule_once(lambda dt: self.show_popup('Error', 'No files selected or available to send'))
                    return
                
                # Send message first
                if self.tg_message.text.strip():
                    bot.send_message(self.tg_message.text)
                
                # Send files
                sent_count = 0
                for file_path in files_to_send:
                    file_name = os.path.basename(file_path)
                    file_size = os.path.getsize(file_path) / 1024 / 1024  # MB
                    
                    caption = f"📦 {file_name} ({file_size:.1f} MB)"
                    bot.send_document(file_path, caption)
                    sent_count += 1
                    
                    logger.info(f"Sent file to Telegram: {file_name}")
                
                success_msg = f'Successfully sent {sent_count} file(s) to Telegram!'
                Clock.schedule_once(lambda dt: self.show_popup('Success', success_msg))
                logger.info(f"Telegram send completed: {sent_count} files")
                
            except TelegramError as e:
                Clock.schedule_once(lambda dt: self.show_popup('Telegram Error', str(e)))
                logger.error(f"Telegram send failed: {e}")
            except Exception as e:
                Clock.schedule_once(lambda dt: self.show_popup('Error', f'Failed to send to Telegram: {e}'))
                logger.error(f"Telegram send unexpected error: {e}")
        
        # Run send in background thread
        threading.Thread(target=_send, daemon=True).start()
        self.show_popup('Info', 'Sending files to Telegram...')
    
    def save_config(self) -> None:
        """Save current configuration."""
        try:
            # Telegram settings
            self.config_manager.set('telegram', 'bot_token', self.bot_token.text)
            self.config_manager.set('telegram', 'chat_id', self.chat_id.text)
            
            # General settings
            self.config_manager.set('settings', 'auto_save', str(self.auto_save.active))
            self.config_manager.set('settings', 'default_output', self.default_output.text)
            self.config_manager.set('settings', 'default_author', self.default_author.text)
            
            # Paths
            self.config_manager.set('paths', 'last_bp_path', self.bp_path.text)
            self.config_manager.set('paths', 'last_rp_path', self.rp_path.text)
            self.config_manager.set('paths', 'last_output_path', self.output_path.text)
            
            # Manifest defaults
            if hasattr(self, 'default_pack_type'):
                self.config_manager.set('manifest_defaults', 'pack_type', self.default_pack_type.text)
            if hasattr(self, 'default_version'):
                self.config_manager.set('manifest_defaults', 'version', self.default_version.text)
            
            self.config_manager.save()
            logger.info("Configuration saved successfully")
            
        except Exception as e:
            logger.error(f"Failed to save configuration: {e}")
    
    def load_config_manual(self, instance) -> None:
        """Manually load configuration."""
        try:
            success = self.config_manager.load()
            if success:
                self._load_ui_config()
                self.show_popup('Success', 'Configuration loaded successfully')
            else:
                self.show_popup('Warning', 'Configuration file not found, using defaults')
        except Exception as e:
            logger.error(f"Failed to load configuration: {e}")
            self.show_popup('Error', f'Failed to load configuration: {e}')
    
    def save_config_manual(self, instance) -> None:
        """Manually save configuration."""
        try:
            self.save_config()
            self.show_popup('Success', 'Configuration saved successfully')
        except Exception as e:
            self.show_popup('Error', f'Failed to save configuration: {e}')
    
    def reset_config(self, instance) -> None:
        """Reset configuration to defaults."""
        def confirm_reset(instance):
            try:
                # Reset UI to defaults
                self.bot_token.text = ''
                self.chat_id.text = ''
                self.auto_save.active = True
                self.default_output.text = ''
                self.default_author.text = ''
                
                if hasattr(self, 'default_pack_type'):
                    self.default_pack_type.text = 'resources'
                if hasattr(self, 'default_version'):
                    self.default_version.text = '1.0.0'
                
                # Clear config file
                if os.path.exists(self.config_manager.config_file):
                    os.remove(self.config_manager.config_file)
                
                self.config_manager = ConfigManager()
                
                logger.info("Configuration reset to defaults")
                self.show_popup('Success', 'Configuration reset to defaults')
                
            except Exception as e:
                logger.error(f"Failed to reset configuration: {e}")
                self.show_popup('Error', f'Failed to reset configuration: {e}')
            
            confirm_popup.dismiss()
        
        # Confirmation dialog
        content = BoxLayout(orientation='vertical', spacing=10, padding=10)
        content.add_widget(Label(
            text='Are you sure you want to reset all settings to defaults?\nThis action cannot be undone.',
            text_size=(350, None),
            halign='center'
        ))
        
        btn_layout = BoxLayout(spacing=10, size_hint_y=None, height=50)
        yes_btn = Button(text='Yes, Reset', background_color=(0.8, 0.2, 0.2, 1))
        yes_btn.bind(on_press=confirm_reset)
        no_btn = Button(text='Cancel', background_color=(0.6, 0.6, 0.6, 1))
        
        btn_layout.add_widget(yes_btn)
        btn_layout.add_widget(no_btn)
        content.add_widget(btn_layout)
        
        confirm_popup = Popup(
            title='Confirm Reset',
            content=content,
            size_hint=(None, None),
            size=(400, 200)
        )
        no_btn.bind(on_press=confirm_popup.dismiss)
        confirm_popup.open()
    
    def show_popup(self, title: str, message: str, size: Tuple[int, int] = (500, 300)) -> None:
        """Show a popup message with improved styling."""
        content = BoxLayout(orientation='vertical', padding=15, spacing=15)
        
        # Message label with better formatting
        message_label = Label(
            text=message,
            text_size=(size[0] - 50, None),
            halign='center',
            valign='middle',
            markup=True
        )
        content.add_widget(message_label)
        
        # OK button with styling
        btn = Button(
            text='OK',
            size_hint_y=None,
            height=50,
            background_color=(0.2, 0.6, 1, 1)
        )
        content.add_widget(btn)
        
        popup = Popup(
            title=title,
            content=content,
            size_hint=(None, None),
            size=size,
            auto_dismiss=True
        )
        
        btn.bind(on_press=popup.dismiss)
        popup.open()
        
        # Auto-dismiss after 10 seconds for success messages
        if title.lower() == 'success':
            Clock.schedule_once(lambda dt: popup.dismiss(), 10)


class MinecraftAddonApp(App):
    """Main application class."""
    
    def build(self) -> MinecraftAddonManager:
        """Build and return the main application widget."""
        logger.info("Starting Minecraft Addon Manager")
        return MinecraftAddonManager()
    
    def on_stop(self) -> bool:
        """Handle application shutdown."""
        logger.info("Minecraft Addon Manager shutting down")
        return True


if __name__ == '__main__':
    try:
        MinecraftAddonApp().run()
    except Exception as e:
        logger.critical(f"Application failed to start: {e}")
        raise