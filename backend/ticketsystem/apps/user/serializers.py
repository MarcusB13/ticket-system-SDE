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
            "pk",
        )

    def get_service_level_agreement(self, obj):
        from ticket.serializers import LightServiceLevelAgreementSerializer

        serviceLevelAgreement = obj.service_level_agreement
        if serviceLevelAgreement:
            return LightServiceLevelAgreementSerializer(serviceLevelAgreement).data
        return None


class UserSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    company = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)
    pk = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = (
            "uuid",
            "username",
            "email",
            "role",
            "is_active",
            "company",
            "created_at",
            "pk",
        )

    def get_company(self, obj):
        data = []
        for company in obj.company.all():
            data.append(CompanySerializer(company).data)
        return data


class AdminUserSerializer(UserSerializer):
    is_active = serializers.BooleanField(read_only=False)

    class Meta:
        model = User
        fields = (
            "uuid",
            "username",
            "email",
            "role",
            "is_active",
            "company",
            "created_at",
            "pk",
        )


class UserCreatorSerializer(UserSerializer):

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "role",
        )
