from django.db import models

# Create your models here.
from rest_framework import serializers

class FileSerializer(serializers.Serializer):
    file = serializers.FileField(max_length=None, allow_empty_file=False)
