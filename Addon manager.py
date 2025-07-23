import os
import json
import zipfile
import configparser
from datetime import datetime
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
from kivy.uix.tabbedpanel import TabbedPanel, TabbedPanelItem
from kivy.core.window import Window
from kivy.uix.progressbar import ProgressBar
from kivy.clock import Clock

class MinecraftAddonManager(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 10
        self.spacing = 10
        
        # Config file path
        self.config_file = 'addon_config.ini'
        self.config = configparser.ConfigParser()
        self.load_config()
        
        # Window setup
        Window.size = (900, 700)
        Window.title = "Minecraft Addon Manager"
        
        self.build_ui()
        
    def build_ui(self):
        # Create tabbed interface
        tab_panel = TabbedPanel()
        tab_panel.do_default_tab = False
        
        # Manifest Tab
        manifest_tab = TabbedPanelItem(text='Manifest')
        manifest_tab.content = self.create_manifest_tab()
        tab_panel.add_widget(manifest_tab)
        
        # Packing Tab
        packing_tab = TabbedPanelItem(text='Pack & Compress')
        packing_tab.content = self.create_packing_tab()
        tab_panel.add_widget(packing_tab)
        
        # Telegram Tab
        telegram_tab = TabbedPanelItem(text='Telegram')
        telegram_tab.content = self.create_telegram_tab()
        tab_panel.add_widget(telegram_tab)
        
        # Config Tab
        config_tab = TabbedPanelItem(text='Settings')
        config_tab.content = self.create_config_tab()
        tab_panel.add_widget(config_tab)
        
        self.add_widget(tab_panel)
        
    def create_manifest_tab(self):
        layout = ScrollView()
        content = BoxLayout(orientation='vertical', spacing=10, size_hint_y=None)
        content.bind(minimum_height=content.setter('height'))
        
        # Manifest form
        form_layout = GridLayout(cols=2, spacing=10, size_hint_y=None, height=600)
        
        # Basic Info
        form_layout.add_widget(Label(text='Name:', size_hint_y=None, height=40))
        self.name_input = TextInput(multiline=False, size_hint_y=None, height=40)
        form_layout.add_widget(self.name_input)
        
        form_layout.add_widget(Label(text='Description:', size_hint_y=None, height=40))
        self.desc_input = TextInput(multiline=True, size_hint_y=None, height=80)
        form_layout.add_widget(self.desc_input)
        
        # Version
        form_layout.add_widget(Label(text='Version (x.x.x):', size_hint_y=None, height=40))
        self.version_input = TextInput(text='1.0.0', multiline=False, size_hint_y=None, height=40)
        form_layout.add_widget(self.version_input)
        
        # UUID fields
        form_layout.add_widget(Label(text='Header UUID:', size_hint_y=None, height=40))
        uuid_layout1 = BoxLayout(size_hint_y=None, height=40)
        self.header_uuid = TextInput(multiline=False)
        uuid_btn1 = Button(text='Generate', size_hint_x=None, width=80)
        uuid_btn1.bind(on_press=lambda x: self.generate_uuid(self.header_uuid))
        uuid_layout1.add_widget(self.header_uuid)
        uuid_layout1.add_widget(uuid_btn1)
        form_layout.add_widget(uuid_layout1)
        
        form_layout.add_widget(Label(text='Module UUID:', size_hint_y=None, height=40))
        uuid_layout2 = BoxLayout(size_hint_y=None, height=40)
        self.module_uuid = TextInput(multiline=False)
        uuid_btn2 = Button(text='Generate', size_hint_x=None, width=80)
        uuid_btn2.bind(on_press=lambda x: self.generate_uuid(self.module_uuid))
        uuid_layout2.add_widget(self.module_uuid)
        uuid_layout2.add_widget(uuid_btn2)
        form_layout.add_widget(uuid_layout2)
        
        # Pack Type
        form_layout.add_widget(Label(text='Pack Type:', size_hint_y=None, height=40))
        self.pack_type = Spinner(
            text='resources',
            values=['resources', 'data'],
            size_hint_y=None, height=40
        )
        form_layout.add_widget(self.pack_type)
        
        # Dependencies
        form_layout.add_widget(Label(text='Enable Dependencies:', size_hint_y=None, height=40))
        self.enable_deps = CheckBox(size_hint_y=None, height=40)
        form_layout.add_widget(self.enable_deps)
        
        form_layout.add_widget(Label(text='Dependency UUID:', size_hint_y=None, height=40))
        uuid_layout3 = BoxLayout(size_hint_y=None, height=40)
        self.dep_uuid = TextInput(multiline=False)
        uuid_btn3 = Button(text='Generate', size_hint_x=None, width=80)
        uuid_btn3.bind(on_press=lambda x: self.generate_uuid(self.dep_uuid))
        uuid_layout3.add_widget(self.dep_uuid)
        uuid_layout3.add_widget(uuid_btn3)
        form_layout.add_widget(uuid_layout3)
        
        form_layout.add_widget(Label(text='Dependency Version:', size_hint_y=None, height=40))
        self.dep_version = TextInput(text='1.0.0', multiline=False, size_hint_y=None, height=40)
        form_layout.add_widget(self.dep_version)
        
        content.add_widget(form_layout)
        
        # Buttons
        btn_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        
        load_btn = Button(text='Load Manifest')
        load_btn.bind(on_press=self.load_manifest)
        btn_layout.add_widget(load_btn)
        
        save_btn = Button(text='Save Manifest')
        save_btn.bind(on_press=self.save_manifest)
        btn_layout.add_widget(save_btn)
        
        generate_btn = Button(text='Generate Manifest.json')
        generate_btn.bind(on_press=self.generate_manifest)
        btn_layout.add_widget(generate_btn)
        
        content.add_widget(btn_layout)
        layout.add_widget(content)
        return layout
        
    def create_packing_tab(self):
        layout = BoxLayout(orientation='vertical', spacing=10, padding=10)
        
        # File selection
        file_layout = GridLayout(cols=2, size_hint_y=None, height=120, spacing=10)
        
        file_layout.add_widget(Label(text='Behavior Pack Folder:'))
        bp_layout = BoxLayout()
        self.bp_path = TextInput(multiline=False)
        bp_btn = Button(text='Browse', size_hint_x=None, width=80)
        bp_btn.bind(on_press=lambda x: self.browse_folder('bp'))
        bp_layout.add_widget(self.bp_path)
        bp_layout.add_widget(bp_btn)
        file_layout.add_widget(bp_layout)
        
        file_layout.add_widget(Label(text='Resource Pack Folder:'))
        rp_layout = BoxLayout()
        self.rp_path = TextInput(multiline=False)
        rp_btn = Button(text='Browse', size_hint_x=None, width=80)
        rp_btn.bind(on_press=lambda x: self.browse_folder('rp'))
        rp_layout.add_widget(self.rp_path)
        rp_layout.add_widget(rp_btn)
        file_layout.add_widget(rp_layout)
        
        file_layout.add_widget(Label(text='Output Directory:'))
        out_layout = BoxLayout()
        self.output_path = TextInput(multiline=False)
        out_btn = Button(text='Browse', size_hint_x=None, width=80)
        out_btn.bind(on_press=lambda x: self.browse_folder('output'))
        out_layout.add_widget(self.output_path)
        out_layout.add_widget(out_btn)
        file_layout.add_widget(out_layout)
        
        layout.add_widget(file_layout)
        
        # Options
        options_layout = BoxLayout(size_hint_y=None, height=50, spacing=20)
        
        self.compress_bp = CheckBox(active=True)
        options_layout.add_widget(Label(text='Compress Behavior Pack'))
        options_layout.add_widget(self.compress_bp)
        
        self.compress_rp = CheckBox(active=True)
        options_layout.add_widget(Label(text='Compress Resource Pack'))
        options_layout.add_widget(self.compress_rp)
        
        layout.add_widget(options_layout)
        
        # Progress bar
        self.progress = ProgressBar(max=100, size_hint_y=None, height=30)
        layout.add_widget(self.progress)
        
        self.status_label = Label(text='Ready', size_hint_y=None, height=30)
        layout.add_widget(self.status_label)
        
        # Pack buttons
        pack_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        
        pack_bp_btn = Button(text='Pack Behavior Only')
        pack_bp_btn.bind(on_press=self.pack_behavior)
        pack_layout.add_widget(pack_bp_btn)
        
        pack_rp_btn = Button(text='Pack Resource Only')
        pack_rp_btn.bind(on_press=self.pack_resource)
        pack_layout.add_widget(pack_rp_btn)
        
        pack_both_btn = Button(text='Pack Both')
        pack_both_btn.bind(on_press=self.pack_both)
        pack_layout.add_widget(pack_both_btn)
        
        layout.add_widget(pack_layout)
        
        return layout
        
    def create_telegram_tab(self):
        layout = BoxLayout(orientation='vertical', spacing=10, padding=10)
        
        # Telegram settings
        tg_layout = GridLayout(cols=2, size_hint_y=None, height=120, spacing=10)
        
        tg_layout.add_widget(Label(text='Bot Token:'))
        self.bot_token = TextInput(multiline=False, password=True)
        tg_layout.add_widget(self.bot_token)
        
        tg_layout.add_widget(Label(text='Chat ID:'))
        self.chat_id = TextInput(multiline=False)
        tg_layout.add_widget(self.chat_id)
        
        tg_layout.add_widget(Label(text='Message:'))
        self.tg_message = TextInput(text='New Minecraft addon pack!', multiline=True)
        tg_layout.add_widget(self.tg_message)
        
        layout.add_widget(tg_layout)
        
        # File selection for sending
        file_select_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        file_select_layout.add_widget(Label(text='Select files to send:'))
        
        self.send_bp = CheckBox(active=True)
        file_select_layout.add_widget(Label(text='Behavior Pack'))
        file_select_layout.add_widget(self.send_bp)
        
        self.send_rp = CheckBox(active=True)
        file_select_layout.add_widget(Label(text='Resource Pack'))
        file_select_layout.add_widget(self.send_rp)
        
        layout.add_widget(file_select_layout)
        
        # Send buttons
        send_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        
        test_btn = Button(text='Test Connection')
        test_btn.bind(on_press=self.test_telegram)
        send_layout.add_widget(test_btn)
        
        send_btn = Button(text='Send to Telegram')
        send_btn.bind(on_press=self.send_to_telegram)
        send_layout.add_widget(send_btn)
        
        layout.add_widget(send_layout)
        
        # Status
        self.tg_status = Label(text='Not connected', size_hint_y=None, height=30)
        layout.add_widget(self.tg_status)
        
        return layout
        
    def create_config_tab(self):
        layout = BoxLayout(orientation='vertical', spacing=10, padding=10)
        
        config_layout = GridLayout(cols=2, spacing=10, size_hint_y=None, height=200)
        
        config_layout.add_widget(Label(text='Auto-save Config:'))
        self.auto_save = CheckBox()
        config_layout.add_widget(self.auto_save)
        
        config_layout.add_widget(Label(text='Default Output Path:'))
        self.default_output = TextInput(multiline=False)
        config_layout.add_widget(self.default_output)
        
        config_layout.add_widget(Label(text='Default Author:'))
        self.default_author = TextInput(multiline=False)
        config_layout.add_widget(self.default_author)
        
        layout.add_widget(config_layout)
        
        btn_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)
        
        load_config_btn = Button(text='Load Config')
        load_config_btn.bind(on_press=self.load_config_manual)
        btn_layout.add_widget(load_config_btn)
        
        save_config_btn = Button(text='Save Config')
        save_config_btn.bind(on_press=self.save_config_manual)
        btn_layout.add_widget(save_config_btn)
        
        layout.add_widget(btn_layout)
        
        return layout
    
    def generate_uuid(self, text_input):
        import uuid
        text_input.text = str(uuid.uuid4())
    
    def browse_folder(self, folder_type):
        def on_selection(instance, selection):
            if selection:
                if folder_type == 'bp':
                    self.bp_path.text = selection[0]
                elif folder_type == 'rp':
                    self.rp_path.text = selection[0]
                elif folder_type == 'output':
                    self.output_path.text = selection[0]
            popup.dismiss()
        
        content = BoxLayout(orientation='vertical')
        filechooser = FileChooserListView(dirselect=True)
        filechooser.bind(on_submit=on_selection)
        
        content.add_widget(filechooser)
        
        btn_layout = BoxLayout(size_hint_y=None, height=50)
        select_btn = Button(text='Select')
        select_btn.bind(on_press=lambda x: on_selection(filechooser, filechooser.selection))
        cancel_btn = Button(text='Cancel')
        
        btn_layout.add_widget(select_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(title=f'Select {folder_type.upper()} Folder', content=content, size_hint=(0.8, 0.8))
        cancel_btn.bind(on_press=popup.dismiss)
        popup.open()
    
    def generate_manifest(self, instance):
        try:
            version_parts = [int(x) for x in self.version_input.text.split('.')]
            dep_version_parts = [int(x) for x in self.dep_version.text.split('.')]
            
            manifest = {
                "format_version": 2,
                "header": {
                    "name": self.name_input.text,
                    "description": self.desc_input.text,
                    "uuid": self.header_uuid.text,
                    "version": version_parts,
                    "min_engine_version": [1, 19, 0]
                },
                "modules": [
                    {
                        "type": self.pack_type.text,
                        "uuid": self.module_uuid.text,
                        "version": version_parts
                    }
                ]
            }
            
            if self.enable_deps.active and self.dep_uuid.text:
                manifest["dependencies"] = [
                    {
                        "uuid": self.dep_uuid.text,
                        "version": dep_version_parts
                    }
                ]
            
            # Save manifest to current directory or selected output
            output_dir = self.output_path.text if self.output_path.text else '.'
            manifest_path = os.path.join(output_dir, 'manifest.json')
            
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
                
            self.show_popup('Success', f'Manifest saved to {manifest_path}')
            
        except Exception as e:
            self.show_popup('Error', f'Failed to generate manifest: {str(e)}')
    
    def load_manifest(self, instance):
        def on_selection(instance, selection):
            if selection:
                try:
                    with open(selection[0], 'r') as f:
                        manifest = json.load(f)
                    
                    # Load data into form
                    self.name_input.text = manifest['header'].get('name', '')
                    self.desc_input.text = manifest['header'].get('description', '')
                    self.header_uuid.text = manifest['header'].get('uuid', '')
                    
                    version = manifest['header'].get('version', [1, 0, 0])
                    self.version_input.text = '.'.join(map(str, version))
                    
                    if manifest.get('modules'):
                        module = manifest['modules'][0]
                        self.module_uuid.text = module.get('uuid', '')
                        self.pack_type.text = module.get('type', 'resources')
                    
                    if manifest.get('dependencies'):
                        dep = manifest['dependencies'][0]
                        self.dep_uuid.text = dep.get('uuid', '')
                        dep_version = dep.get('version', [1, 0, 0])
                        self.dep_version.text = '.'.join(map(str, dep_version))
                        self.enable_deps.active = True
                    
                    self.show_popup('Success', 'Manifest loaded successfully')
                    
                except Exception as e:
                    self.show_popup('Error', f'Failed to load manifest: {str(e)}')
            popup.dismiss()
        
        content = BoxLayout(orientation='vertical')
        filechooser = FileChooserListView(filters=['*.json'])
        filechooser.bind(on_submit=on_selection)
        
        content.add_widget(filechooser)
        
        btn_layout = BoxLayout(size_hint_y=None, height=50)
        select_btn = Button(text='Select')
        select_btn.bind(on_press=lambda x: on_selection(filechooser, filechooser.selection))
        cancel_btn = Button(text='Cancel')
        
        btn_layout.add_widget(select_btn)
        btn_layout.add_widget(cancel_btn)
        content.add_widget(btn_layout)
        
        popup = Popup(title='Load Manifest', content=content, size_hint=(0.8, 0.8))
        cancel_btn.bind(on_press=popup.dismiss)
        popup.open()
    
    def save_manifest(self, instance):
        self.generate_manifest(instance)
    
    def compress_folder(self, folder_path, output_path, pack_name):
        """Compress a folder into a .mcpack file"""
        try:
            zip_path = os.path.join(output_path, f"{pack_name}.mcpack")
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(folder_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_name = os.path.relpath(file_path, folder_path)
                        zipf.write(file_path, arc_name)
            
            return zip_path
        except Exception as e:
            raise Exception(f"Compression failed: {str(e)}")
    
    def pack_behavior(self, instance):
        if not self.bp_path.text:
            self.show_popup('Error', 'Please select behavior pack folder')
            return
        
        self.pack_single('behavior')
    
    def pack_resource(self, instance):
        if not self.rp_path.text:
            self.show_popup('Error', 'Please select resource pack folder')
            return
        
        self.pack_single('resource')
    
    def pack_both(self, instance):
        if not self.bp_path.text or not self.rp_path.text:
            self.show_popup('Error', 'Please select both pack folders')
            return
        
        self.pack_single('both')
    
    def pack_single(self, pack_type):
        try:
            output_dir = self.output_path.text if self.output_path.text else os.getcwd()
            
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            
            self.progress.value = 0
            self.status_label.text = 'Starting compression...'
            
            packed_files = []
            
            if pack_type in ['behavior', 'both'] and self.compress_bp.active:
                self.status_label.text = 'Compressing behavior pack...'
                bp_name = os.path.basename(self.bp_path.text.rstrip('/\\'))
                bp_file = self.compress_folder(self.bp_path.text, output_dir, f"{bp_name}_BP")
                packed_files.append(bp_file)
                self.progress.value = 50 if pack_type == 'both' else 100
            
            if pack_type in ['resource', 'both'] and self.compress_rp.active:
                self.status_label.text = 'Compressing resource pack...'
                rp_name = os.path.basename(self.rp_path.text.rstrip('/\\'))
                rp_file = self.compress_folder(self.rp_path.text, output_dir, f"{rp_name}_RP")
                packed_files.append(rp_file)
                self.progress.value = 100
            
            self.status_label.text = f'Completed! {len(packed_files)} pack(s) created'
            self.last_packed_files = packed_files
            
            if self.auto_save.active:
                self.save_config()
            
            file_list = '\n'.join([os.path.basename(f) for f in packed_files])
            self.show_popup('Success', f'Packs created successfully:\n{file_list}')
            
        except Exception as e:
            self.status_label.text = 'Error occurred'
            self.show_popup('Error', f'Packing failed: {str(e)}')
    
    def test_telegram(self, instance):
        if not self.bot_token.text or not self.chat_id.text:
            self.show_popup('Error', 'Please enter bot token and chat ID')
            return
        
        try:
            url = f"https://api.telegram.org/bot{self.bot_token.text}/getMe"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data['ok']:
                    self.tg_status.text = f"Connected to bot: {data['result']['first_name']}"
                    self.show_popup('Success', 'Telegram connection successful!')
                else:
                    self.tg_status.text = 'Connection failed'
                    self.show_popup('Error', 'Invalid bot token')
            else:
                self.tg_status.text = 'Connection failed'
                self.show_popup('Error', f'HTTP Error: {response.status_code}')
                
        except Exception as e:
            self.tg_status.text = 'Connection failed'
            self.show_popup('Error', f'Connection failed: {str(e)}')
    
    def send_to_telegram(self, instance):
        if not hasattr(self, 'last_packed_files') or not self.last_packed_files:
            self.show_popup('Error', 'No packed files available. Pack some files first.')
            return
        
        if not self.bot_token.text or not self.chat_id.text:
            self.show_popup('Error', 'Please enter bot token and chat ID')
            return
        
        try:
            files_to_send = []
            
            for file_path in self.last_packed_files:
                if ('_BP' in file_path and self.send_bp.active) or \
                   ('_RP' in file_path and self.send_rp.active):
                    files_to_send.append(file_path)
            
            if not files_to_send:
                self.show_popup('Error', 'No files selected to send')
                return
            
            # Send message first
            url = f"https://api.telegram.org/bot{self.bot_token.text}/sendMessage"
            data = {
                'chat_id': self.chat_id.text,
                'text': self.tg_message.text
            }
            
            response = requests.post(url, data=data, timeout=30)
            
            # Send files
            for file_path in files_to_send:
                if os.path.exists(file_path):
                    url = f"https://api.telegram.org/bot{self.bot_token.text}/sendDocument"
                    
                    with open(file_path, 'rb') as f:
                        files = {'document': f}
                        data = {'chat_id': self.chat_id.text}
                        
                        response = requests.post(url, data=data, files=files, timeout=60)
                        
                        if response.status_code != 200:
                            raise Exception(f"Failed to send {os.path.basename(file_path)}")
            
            self.show_popup('Success', f'Successfully sent {len(files_to_send)} file(s) to Telegram!')
            
        except Exception as e:
            self.show_popup('Error', f'Failed to send to Telegram: {str(e)}')
    
    def load_config(self):
        """Load configuration from file"""
        if os.path.exists(self.config_file):
            self.config.read(self.config_file)
            
        # Load values into UI
        if hasattr(self, 'bot_token'):
            self.bot_token.text = self.config.get('telegram', 'bot_token', fallback='')
            self.chat_id.text = self.config.get('telegram', 'chat_id', fallback='')
            self.auto_save.active = self.config.getboolean('settings', 'auto_save', fallback=True)
            self.default_output.text = self.config.get('settings', 'default_output', fallback='')
            self.default_author.text = self.config.get('settings', 'default_author', fallback='')
    
    def save_config(self):
        """Save configuration to file"""
        if not self.config.has_section('telegram'):
            self.config.add_section('telegram')
        if not self.config.has_section('settings'):
            self.config.add_section('settings')
        
        self.config.set('telegram', 'bot_token', self.bot_token.text)
        self.config.set('telegram', 'chat_id', self.chat_id.text)
        self.config.set('settings', 'auto_save', str(self.auto_save.active))
        self.config.set('settings', 'default_output', self.default_output.text)
        self.config.set('settings', 'default_author', self.default_author.text)
        
        with open(self.config_file, 'w') as f:
            self.config.write(f)
    
    def load_config_manual(self, instance):
        self.load_config()
        self.show_popup('Success', 'Configuration loaded')
    
    def save_config_manual(self, instance):
        self.save_config()
        self.show_popup('Success', 'Configuration saved')
    
    def show_popup(self, title, message):
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        content.add_widget(Label(text=message, text_size=(400, None), halign='center'))
        
        btn = Button(text='OK', size_hint_y=None, height=50)
        content.add_widget(btn)
        
        popup = Popup(title=title, content=content, size_hint=(None, None), size=(450, 200))
        btn.bind(on_press=popup.dismiss)
        popup.open()

class MinecraftAddonApp(App):
    def build(self):
        return MinecraftAddonManager()

if __name__ == '__main__':
    MinecraftAddonApp().run()