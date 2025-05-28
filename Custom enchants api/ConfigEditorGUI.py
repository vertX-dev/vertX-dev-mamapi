import re 
import json
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import os

class EnchantmentManagerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Enchantment Manager")
        self.root.geometry("600x700")
        self.root.configure(bg='#2b2b2b')
        
        # Default JS file
        self.js_file = "cEnchantmentsData.js"
        
        self.create_widgets()
        
    def create_widgets(self):
        # Configure style
        style = ttk.Style()
        style.theme_use('clam')
        style.configure('Title.TLabel', font=('Arial', 16, 'bold'), background='#2b2b2b', foreground='white')
        style.configure('TLabel', background='#2b2b2b', foreground='white')
        style.configure('TFrame', background='#2b2b2b')
        
        # Main container
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = ttk.Label(main_frame, text=" Enchantment Manager", style='Title.TLabel')
        title_label.pack(pady=(0, 20))
        
        # File selection
        file_frame = ttk.Frame(main_frame)
        file_frame.pack(fill=tk.X, pady=(0, 20))
        
        ttk.Label(file_frame, text="JS File:").pack(side=tk.LEFT)
        self.file_var = tk.StringVar(value=self.js_file)
        file_entry = ttk.Entry(file_frame, textvariable=self.file_var, width=40)
        file_entry.pack(side=tk.LEFT, padx=(10, 5), fill=tk.X, expand=True)
        
        browse_btn = ttk.Button(file_frame, text="Browse", command=self.browse_file)
        browse_btn.pack(side=tk.RIGHT)
        
        # Create notebook for tabs
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        # Add Enchantment Tab
        add_frame = ttk.Frame(notebook, padding="10")
        notebook.add(add_frame, text="Add Enchantment")
        
        self.create_add_tab(add_frame)
        
        # View Enchantments Tab
        view_frame = ttk.Frame(notebook, padding="10")
        notebook.add(view_frame, text="View Enchantments")
        
        self.create_view_tab(view_frame)
        
    def create_add_tab(self, parent):
        # Scrollable frame
        canvas = tk.Canvas(parent, bg='#2b2b2b')
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Basic Info Section
        basic_frame = ttk.LabelFrame(scrollable_frame, text="Basic Information", padding="10")
        basic_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Key
        ttk.Label(basic_frame, text="Enchantment Key:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.key_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.key_var, width=30).grid(row=0, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # ID
        ttk.Label(basic_frame, text="ID:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.id_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.id_var, width=30).grid(row=1, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Name
        ttk.Label(basic_frame, text="Name (§ color codes):").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.name_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.name_var, width=30).grid(row=2, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Max Level
        ttk.Label(basic_frame, text="Max Level:").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.max_lvl_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.max_lvl_var, width=30).grid(row=3, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Description
        ttk.Label(basic_frame, text="Description:").grid(row=4, column=0, sticky=tk.W, pady=2)
        self.desc_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.desc_var, width=30).grid(row=4, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # XP Cost
        ttk.Label(basic_frame, text="XP Cost:").grid(row=5, column=0, sticky=tk.W, pady=2)
        self.xp_var = tk.StringVar()
        ttk.Entry(basic_frame, textvariable=self.xp_var, width=30).grid(row=5, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Tags Section
        tags_frame = ttk.LabelFrame(scrollable_frame, text="Tags (comma-separated)", padding="10")
        tags_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(tags_frame, text="Enchant On:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.enchant_on_var = tk.StringVar()
        ttk.Entry(tags_frame, textvariable=self.enchant_on_var, width=40).grid(row=0, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        ttk.Label(tags_frame, text="Structure Group:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.struct_grp_var = tk.StringVar()
        ttk.Entry(tags_frame, textvariable=self.struct_grp_var, width=40).grid(row=1, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        ttk.Label(tags_frame, text="Enchantment Group:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.ench_grp_var = tk.StringVar()
        ttk.Entry(tags_frame, textvariable=self.ench_grp_var, width=40).grid(row=2, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Triggers Section
        triggers_frame = ttk.LabelFrame(scrollable_frame, text="Triggers", padding="10")
        triggers_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(triggers_frame, text="Event:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.event_var = tk.StringVar()
        ttk.Entry(triggers_frame, textvariable=self.event_var, width=30).grid(row=0, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        ttk.Label(triggers_frame, text="Target:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.target_var = tk.StringVar()
        ttk.Entry(triggers_frame, textvariable=self.target_var, width=30).grid(row=1, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        ttk.Label(triggers_frame, text="Function:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.function_var = tk.StringVar()
        ttk.Entry(triggers_frame, textvariable=self.function_var, width=30).grid(row=2, column=1, sticky=tk.W, padx=(10, 0), pady=2)
        
        # Buttons
        button_frame = ttk.Frame(scrollable_frame)
        button_frame.pack(fill=tk.X, pady=(20, 0))
        
        add_btn = ttk.Button(button_frame, text="Add Enchantment", command=self.add_enchantment)
        add_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        clear_btn = ttk.Button(button_frame, text="Clear Form", command=self.clear_form)
        clear_btn.pack(side=tk.LEFT)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def create_view_tab(self, parent):
        # Text widget to display enchantments
        text_frame = ttk.Frame(parent)
        text_frame.pack(fill=tk.BOTH, expand=True)
        
        self.text_widget = tk.Text(text_frame, wrap=tk.WORD, bg='#1e1e1e', fg='white', 
                                  font=('Consolas', 10), state=tk.DISABLED)
        scrollbar_text = ttk.Scrollbar(text_frame, orient="vertical", command=self.text_widget.yview)
        self.text_widget.configure(yscrollcommand=scrollbar_text.set)
        
        self.text_widget.pack(side="left", fill="both", expand=True)
        scrollbar_text.pack(side="right", fill="y")
        
        # Refresh button
        refresh_btn = ttk.Button(parent, text="Refresh", command=self.load_enchantments)
        refresh_btn.pack(pady=(10, 0))
        
        # Load enchantments on startup
        self.load_enchantments()
        
    def browse_file(self):
        filename = filedialog.askopenfilename(
            title="Select JavaScript file",
            filetypes=[("JavaScript files", "*.js"), ("All files", "*.*")]
        )
        if filename:
            self.file_var.set(filename)
            self.js_file = filename
            
    def parse_list(self, text):
        if not text.strip():
            return []
        return [item.strip() for item in text.split(",") if item.strip()]
        
    def validate_inputs(self):
        errors = []
        
        if not self.key_var.get().strip():
            errors.append("Enchantment key is required")
            
        try:
            int(self.id_var.get())
        except ValueError:
            errors.append("ID must be a number")
            
        if not self.name_var.get().strip():
            errors.append("Name is required")
            
        try:
            int(self.max_lvl_var.get())
        except ValueError:
            errors.append("Max level must be a number")
            
        try:
            int(self.xp_var.get())
        except ValueError:
            errors.append("XP cost must be a number")
            
        return errors
        
    def add_enchantment(self):
        # Validate inputs
        errors = self.validate_inputs()
        if errors:
            messagebox.showerror("Validation Error", "\n".join(errors))
            return
            
        # Collect data
        key = self.key_var.get().strip()
        data = {
            "id": int(self.id_var.get()),
            "name": self.name_var.get().strip(),
            "maxLvl": int(self.max_lvl_var.get()),
            "description": self.desc_var.get().strip(),
            "xpCost": int(self.xp_var.get()),
            "enchantOn": self.parse_list(self.enchant_on_var.get()),
            "structureGroup": self.parse_list(self.struct_grp_var.get()),
            "enchantmentGroup": self.parse_list(self.ench_grp_var.get()),
            "triggers": {
                "event": self.event_var.get().strip(),
                "target": self.target_var.get().strip(),
                "function": self.function_var.get().strip()
            }
        }
        
        try:
            self.save_enchantment(key, data)
            messagebox.showinfo("Success", f"✅ Added enchantment '{key}' successfully!")
            self.clear_form()
            self.load_enchantments()  # Refresh the view
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add enchantment: {str(e)}")
            
    def clear_form(self):
        variables = [
            self.key_var, self.id_var, self.name_var, self.max_lvl_var,
            self.desc_var, self.xp_var, self.enchant_on_var, self.struct_grp_var,
            self.ench_grp_var, self.event_var, self.target_var, self.function_var
        ]
        for var in variables:
            var.set("")
            
    def dict_to_js(self, obj, indent_level=1):
        indent = "    " * indent_level
        if isinstance(obj, dict):
            lines = []
            for k, v in obj.items():
                lines.append(f"{indent}{k}: {self.dict_to_js(v, indent_level + 1)}")
            open_brace = "{"
            close_indent = "    " * (indent_level - 1)
            return open_brace + "\n" + ",\n".join(lines) + f"\n{close_indent}}}"
        elif isinstance(obj, list):
            return "[" + ", ".join(json.dumps(i) for i in obj) + "]"
        elif isinstance(obj, str):
            return json.dumps(obj)
        else:
            return str(obj)
            
    def save_enchantment(self, key, data):
        js_file = self.file_var.get()
        
        if not os.path.exists(js_file):
            # Create new file if it doesn't exist
            content = "export const enchantments = {\n};"
        else:
            with open(js_file, "r", encoding="utf-8") as f:
                content = f.read()

        # Remove placeholder 'exampleEnchant' block entirely
        content = re.sub(r"^\s*exampleEnchant\s*:\s*\{[\s\S]*?\},?\n", "", content, flags=re.MULTILINE)

        # Find export block
        pattern = r"(export const enchantments\s*=\s*\{)([\s\S]*?)(\};)"
        match = re.search(pattern, content)
        if not match:
            raise Exception("Could not find 'export const enchantments = {' block.")

        prefix, body, suffix = match.groups()

        # Prevent duplicates
        if re.search(rf"^\s*{re.escape(key)}\s*:", body, flags=re.MULTILINE):
            raise Exception(f"Enchantment '{key}' already exists.")

        # Insert new enchantment - handle empty vs non-empty body
        if body.strip():
            new_entry = f"{body.rstrip()},\n    {key}: {self.dict_to_js(data, 1)}"
        else:
            new_entry = f"\n    {key}: {self.dict_to_js(data, 1)}\n"
        
        updated = prefix + new_entry + "\n" + suffix

        with open(js_file, "w", encoding="utf-8") as f:
            f.write(updated)
            
    def load_enchantments(self):
        js_file = self.file_var.get()
        
        self.text_widget.config(state=tk.NORMAL)
        self.text_widget.delete(1.0, tk.END)
        
        if not os.path.exists(js_file):
            self.text_widget.insert(tk.END, "📄 File not found. Create your first enchantment to get started!")
        else:
            try:
                with open(js_file, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # Find and extract enchantments
                pattern = r"export const enchantments\s*=\s*\{([\s\S]*?)\};"
                match = re.search(pattern, content)
                
                if match:
                    enchantments_content = match.group(1)
                    if enchantments_content.strip():
                        self.text_widget.insert(tk.END, f"📜 Current Enchantments:\n\n{content}")
                    else:
                        self.text_widget.insert(tk.END, "📄 No enchantments found. The file is empty.")
                else:
                    self.text_widget.insert(tk.END, "❌ Could not parse enchantments from file.")
                    
            except Exception as e:
                self.text_widget.insert(tk.END, f"❌ Error reading file: {str(e)}")
                
        self.text_widget.config(state=tk.DISABLED)

def main():
    root = tk.Tk()
    app = EnchantmentManagerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()