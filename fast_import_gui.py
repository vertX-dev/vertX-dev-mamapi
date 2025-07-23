import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
from pathlib import Path
import subprocess

CONFIG_FILE = 'fast_import_config.json'

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

        # Compose version string
        version_str = f"v{main_version}.{sub_version}"
        if beta:
            version_str += ' Beta'

        # Call FAST IMPORT.py with arguments (assume it supports CLI args, else adapt)
        args = [
            'python3', 'FAST IMPORT.py',
            '--folder', folder,
            '--name', name,
            '--main-version', main_version,
            '--sub-version', sub_version,
            '--behavior', str(behavior),
            '--resource', str(resource),
            '--beta', str(beta)
        ]
        try:
            subprocess.run(args, check=True)
            messagebox.showinfo('Success', f'Import completed for {name} {version_str}')
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

def main():
    root = tk.Tk()
    app = FastImportGUI(root)
    root.mainloop()

if __name__ == '__main__':
    main()