from rest_framework import serializers
from user.serializers import CompanySerializer, UserSerializer

from .constants import TicketStatus
from .models import KnownError, ServiceLevelAgreement, Ticket


class ServiceLevelAgreementSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    company = serializers.SerializerMethodField()

    class Meta:
        model = ServiceLevelAgreement
        fields = (
            "uuid",
            "product",
            "max_response_time",
            "max_resolution_time",
            "is_accepted",
            "company",
        )

    def get_company(self, obj):
        company = obj.company.first()
        data = CompanySerializer(company).data
        return data


class LightServiceLevelAgreementSerializer(ServiceLevelAgreementSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")

    class Meta:
        model = ServiceLevelAgreement
        fields = (
            "uuid",
            "product",
            "max_response_time",
            "max_resolution_time",
            "is_accepted",
        )


class TicketSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    assigned = UserSerializer(read_only=False, required=False)
    due_date = serializers.DateTimeField(required=False)
    service_level_agreement = ServiceLevelAgreementSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Ticket
        fields = (
            "uuid",
            "subject",
            "assigned",
            "created_by",
            "priority",
            "status",
            "level",
            "due_date",
            "created_at",
            "description",
            "service_level_agreement",
            "solution",
            "note",
            "pk",
        )

    def validate(self, attrs):
        status = attrs.get("status")
        solution = attrs.get("solution")

        if status == TicketStatus.CLOSED and not solution:
            raise serializers.ValidationError(
                "Solution is required when closing a ticket"
            )

        if status == TicketStatus.CLOSED and solution:
            if len(solution) < 20:
                raise serializers.ValidationError(
                    "Solution must be at least 20 characters long"
                )

        if not self.instance:
            return attrs

        note = attrs.get("note")
        level = attrs.get("level")
        uuid = self.instance.uuid
        ticket = Ticket.objects.filter(uuid=uuid).first()

        if level != ticket.level:
            if not note:
                raise serializers.ValidationError(
                    "Note is required when changing level"
                )
        return attrs


class MyTicketSerializer(TicketSerializer):
    class Meta:
        model = Ticket
        fields = (
            "uuid",
            "subject",
            "assigned",
            "created_by",
            "status",
            "level",
            "due_date",
            "created_at",
            "description",
            "service_level_agreement",
            "pk",
        )


class KnownErrorSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True, format="hex")
    solution_ticket = TicketSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = KnownError
        fields = (
            "uuid",
            "error",
            "solution_ticket",
            "created_at",
            "created_by",
            "pk",
        )
