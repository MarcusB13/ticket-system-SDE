from rest_framework import serializers
from user.serializers import CompanySerializer, UserSerializer

from .models import ServiceLevelAgreement, Ticket


class ServiceLevelAgreementSerializer(serializers.ModelSerializer):
    company = CompanySerializer(many=True, read_only=True)

    class Meta:
        model = ServiceLevelAgreement
        fields = (
            "product",
            "max_respnse_time",
            "max_resolution_time",
            "is_accepted",
            "company",
        )


class TicketSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    assigned = UserSerializer(read_only=True)
    due_date = serializers.DateTimeField()
    service_level_agreement = ServiceLevelAgreementSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = (
            "uuid",
            "subject",
            "assigned",
            "priority",
            "status",
            "level",
            "due_date",
            "description",
            "service_level_agreement",
        )
