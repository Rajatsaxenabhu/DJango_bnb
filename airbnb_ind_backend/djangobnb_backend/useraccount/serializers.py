from rest_framework import serializers

from .models import User

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'avatar_url'
        )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'avatar']  # Include fields that can be updated

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.avatar=validated_data.get('avatar')
        instance.save()
        return instance