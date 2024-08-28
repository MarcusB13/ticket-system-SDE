import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from .constants import Roles


class BaseModel(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)


class Company(BaseModel):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    vat_no = models.CharField(max_length=255)
    service_level_agreement = models.ForeignKey(
        "ticket.ServiceLevelAgreement",
        on_delete=models.DO_NOTHING,
        related_name="company",
        null=True,
        blank=True,
    )

    def __str__(self):
        return "{name} {city}".format(name=self.name, city=self.city)


class User(AbstractUser, BaseModel):
    username = models.CharField(
        "username",
        max_length=150,
        unique=True,
        help_text="150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        validators=[AbstractUser.username_validator],
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )

    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=255, choices=Roles.choices, default=Roles.USER)
    is_staff = models.BooleanField(default=False)

    company = models.ManyToManyField(Company, related_name="users")

    def __str__(self):
        return "{name} {email}".format(name=self.username, email=self.email)

    @property
    def is_authenticated(self):
        return True
