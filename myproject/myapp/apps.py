from django.apps import AppConfig

class MyAppConfig(AppConfig):
    name = 'myapp'

    def ready(self):
        import myapp.signals  # Ensure signals are loaded
