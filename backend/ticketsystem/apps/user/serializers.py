from rest_framework import serializers

from .models import Company, User


class CompanySerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    service_level_agreement = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Company
        fields = (
            "uuid",
            "name",
            "city",
            "address",
            "email",
            "vat_no",
            "service_level_agreement",
        )

    def get_service_level_agreement(self, obj):
        return obj.service_level_agreement.uuid.hex


class UserSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    company = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "uuid",
            "username",
            "email",
            "role",
            "is_active",
            "company",
        )

    def get_company(self, obj):
        data = []
        for company in obj.company.all():
            data.append(CompanySerializer(company).data)
        return data


class UserCreatorSerializer(UserSerializer):

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "email",
            "role",
        )
