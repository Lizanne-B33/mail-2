from django.contrib import admin
from django.contrib.auth.models import User
from .models import Email

# Register your models here.

admin.site.register(Email)
admin.site.register(User)
