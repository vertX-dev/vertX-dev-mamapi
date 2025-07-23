# Telegram File Manager App (Kivy + python-telegram-bot)
# Note: Needs packaging with Buildozer to run on Android

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.scrollview import ScrollView
from kivy.uix.label import Label
from kivy.clock import Clock
import os
import threading

from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from telegram import Update
import asyncio

BOT_TOKEN = "YOUR_BOT_TOKEN"

class FileManager(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'

        self.status_label = Label(text="[b]Telegram File Manager[/b]", markup=True, size_hint_y=None, height=40)
        self.add_widget(self.status_label)

        self.scroll = ScrollView(size_hint=(1, 1))
        self.file_box = BoxLayout(orientation='vertical', size_hint_y=None)
        self.file_box.bind(minimum_height=self.file_box.setter('height'))

        self.scroll.add_widget(self.file_box)
        self.add_widget(self.scroll)

        self.refresh_file_list()

    def refresh_file_list(self):
        self.file_box.clear_widgets()
        for f in os.listdir('.'):
            btn = Button(text=f, size_hint_y=None, height=40)
            self.file_box.add_widget(btn)

    def set_status(self, text):
        self.status_label.text = text

class TelegramFileBot:
    def __init__(self, app):
        self.app = app
        self.loop = asyncio.new_event_loop()

    async def start(self):
        app = ApplicationBuilder().token(BOT_TOKEN).build()

        app.add_handler(CommandHandler("files", self.list_files))
        app.add_handler(CommandHandler("get", self.send_file))

        await app.initialize()
        await app.start()
        await app.updater.start_polling()
        await app.updater.idle()

    async def list_files(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        files = os.listdir('.')
        text = "\n".join(files)
        await update.message.reply_text(f"📂 Files:\n{text}")
        Clock.schedule_once(lambda dt: self.app.file_manager.set_status("Listed files via Telegram."), 0)

    async def send_file(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not context.args:
            await update.message.reply_text("Usage: /get filename")
            return

        filename = " ".join(context.args)
        if os.path.exists(filename):
            await update.message.reply_document(open(filename, "rb"))
            Clock.schedule_once(lambda dt: self.app.file_manager.set_status(f"Sent file: {filename}"), 0)
        else:
            await update.message.reply_text("File not found.")

class MainApp(App):
    def build(self):
        self.file_manager = FileManager()
        self.telegram_bot = TelegramFileBot(self)
        threading.Thread(target=self.telegram_bot.loop.run_until_complete, args=(self.telegram_bot.start(),), daemon=True).start()
        return self.file_manager

if __name__