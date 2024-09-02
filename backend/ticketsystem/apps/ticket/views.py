from datetime import datetime, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from user.auth import IsPermissionsHigherThanUser, IsUserAdmin
from user.constants import Roles
from user.models import Company, User

from .constants import TicketStatus
from .models import KnownError, ServiceLevelAgreement, Ticket
from .serializers import (
    CompanySerializer,
    KnownErrorSerializer,
    MyTicketSerializer,
    ServiceLevelAgreementSerializer,
    TicketSerializer,
)


class BasicPageination(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 500

    def paginate(self, queryset, request, context=None, **args):
        page = self.paginate_queryset(queryset.distinct(), request)
        if page is not None:
            if context is None:
                serializer = self.serializer_class(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.serializer_class(page, many=True, context=context)
            return self.get_paginated_response(serializer.data)

        return self.get_paginated_response([])


class GetTicketsView(APIView, BasicPageination):
    """ """

    permission_classes = (IsAuthenticated,)
    serializer_class = TicketSerializer

    def get(self, request, *args, **kwargs):
        tickets = Ticket.objects.filter(deleted_at__isnull=True)

        data = self.paginate(tickets, request).data
        return Response(data, status=status.HTTP_200_OK)


class GetTicketDetailsView(APIView, BasicPageination):
    """ """

    permission_classes = (IsAuthenticated,)
    serializer_class = None

    def get(self, request, *args, **kwargs):
        tickets = Ticket.objects.filter(deleted_at__isnull=True)
        totalTicketsCount = tickets.count()

        deletedTicekts = Ticket.objects.filter(
            status=TicketStatus.DELETED, deleted_at__isnull=True
        )
        deletedTicektsCount = deletedTicekts.count()

        inProgressTickets = Ticket.objects.filter(
            status=TicketStatus.PENDING, deleted_at__isnull=True
        )
        inProgressTicketsCount = inProgressTickets.count()

        closedTickets = Ticket.objects.filter(
            status=TicketStatus.CLOSED, deleted_at__isnull=True
        )
        closedTicketsCount = closedTickets.count()

        data = {
            "totalTicketsCount": totalTicketsCount,
            "deletedTicektsCount": deletedTicektsCount,
            "inProgressTicketsCount": inProgressTicketsCount,
            "closedTicketsCount": closedTicketsCount,
        }
        return Response(data, status=status.HTTP_200_OK)


class TicketView(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = TicketSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serviceLevelAgreementUuid = request.data.get("service_level_agreement")
        serviceLevelAgreement = ServiceLevelAgreement.objects.filter(
            uuid=serviceLevelAgreementUuid
        ).first()

        if not serviceLevelAgreement:
            return Response(
                {"error": "Service level agreement not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if serializer.is_valid():
            serializer.save()

            ticket = serializer.instance
            ticket.service_level_agreement = serviceLevelAgreement
            ticket.created_by = request.user

            today = datetime.now()
            ticket.due_date = today + timedelta(
                days=serviceLevelAgreement.max_response_time
            )
            ticket.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetMyTicketsView(APIView, BasicPageination):
    permission_classes = (IsAuthenticated,)
    serializer_class = MyTicketSerializer

    def get(self, request, *args, **kwargs):
        tickets = Ticket.objects.filter(
            created_by=request.user, deleted_at__isnull=True
        )
        data = self.paginate(tickets, request).data
        return Response(data, status=status.HTTP_200_OK)


class CompaniesView(APIView):
    permission_classes = (
        IsAuthenticated,
        IsPermissionsHigherThanUser,
    )
    serializer_class = CompanySerializer

    def get(self, request, *args, **kwargs):
        companies = Company.objects.filter(deleted_at__isnull=True)
        return Response(
            self.serializer_class(companies, many=True).data, status=status.HTTP_200_OK
        )

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            company = serializer.instance

            serviceLevelAgreementData = data.get("service_level_agreement")
            agreementSerializer = ServiceLevelAgreementSerializer(
                data=serviceLevelAgreementData
            )
            if agreementSerializer.is_valid():
                agreementSerializer.save()

                company.service_level_agreement = agreementSerializer.instance
                company.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            company.delete()
            return Response(
                agreementSerializer.error_messages, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"error": serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST
        )


class SingleCompanyView(APIView):
    permission_classes = (
        IsAuthenticated,
        IsPermissionsHigherThanUser,
    )
    serializer_class = CompanySerializer

    def get(self, request, *args, **kwargs):
        companyUuid = kwargs.get("company_uuid")
        company = get_object_or_404(Company, uuid=companyUuid, deleted_at__isnull=True)

        data = self.serializer_class(company).data
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        companyUuid = kwargs.get("company_uuid")
        company = get_object_or_404(Company, uuid=companyUuid, deleted_at__isnull=True)
        data = request.data

        serializer = self.serializer_class(company, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()

            serviceLevelAgreementData = data.get("service_level_agreement")
            agreementSerializer = ServiceLevelAgreementSerializer(
                company.service_level_agreement,
                data=serviceLevelAgreementData,
                partial=True,
            )
            if agreementSerializer.is_valid():
                agreementSerializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                agreementSerializer.error_messages, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"error": serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST
        )


class MyAssignedTicketsView(APIView, BasicPageination):
    permission_classes = (IsAuthenticated, IsPermissionsHigherThanUser)
    serializer_class = TicketSerializer

    def get(self, request, *args, **kwargs):
        tickets = Ticket.objects.filter(assigned=request.user, deleted_at__isnull=True)
        data = self.paginate(tickets, request).data
        return Response(data, status=status.HTTP_200_OK)


class SingleTicketView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketSerializer

    def get(self, request, *args, **kwargs):
        ticketUuid = kwargs.get("ticket_uuid")
        ticket = get_object_or_404(Ticket, uuid=ticketUuid)
        return Response(self.serializer_class(ticket).data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        ticketUuid = kwargs.get("ticket_uuid")
        ticket = get_object_or_404(Ticket, uuid=ticketUuid)
        serializer = self.serializer_class(ticket, data=request.data, partial=True)
        assignee = request.data.get("assignee")
        assignedUser = User.objects.filter(uuid=assignee).first()

        if request.user.role not in Roles.higherThanUser:
            return Response(
                {"error": "You do not have permission to edit tickets"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if assignedUser:
            if assignedUser != ticket.assigned:
                if request.user.role != Roles.ADMIN and assignedUser != request.user:
                    return Response(
                        {
                            "error": "You do not have permission to assign tickets to others"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        if serializer.is_valid():
            serializer.save()

            ticket.assigned = assignedUser
            ticket.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KnownErrorsView(APIView, BasicPageination):
    permission_classes = (IsAuthenticated, IsPermissionsHigherThanUser)
    serializer_class = KnownErrorSerializer

    def get(self, request, *args, **kwargs):
        knownErrors = KnownError.objects.filter(deleted_at__isnull=True)
        data = self.paginate(knownErrors, request).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        error = request.data.get("error")

        ticketUuid = request.data.get("ticket_uuid")
        ticket = get_object_or_404(Ticket, uuid=ticketUuid)
        knownError = KnownError.objects.create(
            error=error,
            solution_ticket=ticket,
            created_by=request.user,
        )

        data = self.serializer_class(knownError).data
        return Response(data, status=status.HTTP_201_CREATED)


class SearchTicketsView(APIView, BasicPageination):
    permission_classes = (IsAuthenticated, IsPermissionsHigherThanUser)
    serializer_class = TicketSerializer
    page_size = 10

    def get(self, request, *args, **kwargs):
        query = request.query_params
        search = query.get("query")
        tickets = Ticket.objects.filter(
            subject__icontains=search, deleted_at__isnull=True
        )
        data = self.paginate(tickets, request).data
        return Response(data, status=status.HTTP_200_OK)
