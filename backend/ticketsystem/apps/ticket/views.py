from datetime import datetime, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .constants import TicketStatus
from .models import ServiceLevelAgreement, Ticket
from .serializers import MyTicketSerializer, TicketSerializer


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

        deletedTicekts = Ticket.objects.filter(deleted_at__isnull=False)
        deletedTicektsCount = deletedTicekts.count()

        inProgressTickets = Ticket.objects.filter(
            status=TicketStatus.IN_PROGRESS, deleted_at__isnull=True
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

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
