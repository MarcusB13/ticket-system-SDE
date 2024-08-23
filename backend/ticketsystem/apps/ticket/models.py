from django.db import models
from user.models import BaseModel, Company, User

from .constants import Priority, TicketStatus


class Ticket(BaseModel):
    subject = models.CharField(max_length=255)
    assigned = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="assigned_tickets",
        null=True,
        blank=True,
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="created_tickets",
        null=True,
        blank=True,
    )
    priority = models.CharField(
        max_length=16, choices=Priority.CHOICES, blank=False, null=False
    )
    status = models.CharField(
        max_length=16, choices=TicketStatus.CHOICES, blank=False, null=False
    )
    level = models.IntegerField(default=1)
    due_date = models.DateTimeField()
    description = models.TextField()
    service_level_agreement = models.ForeignKey(
        "ticket.ServiceLevelAgreement",
        on_delete=models.CASCADE,
        related_name="tickets",
        blank=True,
        null=True,
    )


class ServiceLevelAgreement(BaseModel):
    product = models.CharField(max_length=128)
    max_respnse_time = models.IntegerField()
    max_resolution_time = models.IntegerField()

    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return "{company}".format(company=self.company.first().__str__())
