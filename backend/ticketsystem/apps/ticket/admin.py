from django.contrib import admin
from djangoql.admin import DjangoQLSearchMixin

from .models import ServiceLevelAgreement, Ticket

# Register your models here.


class TicketAdmin(DjangoQLSearchMixin, admin.ModelAdmin):
    list_display = [
        "subject",
        "assigned",
        "created_at",
    ]

    readonly_fields = [
        "uuid",
        "created_at",
        "updated_at",
    ]

    def uuid_hex(self, obj):
        return obj.uuid.hex


class SLAAdmin(DjangoQLSearchMixin, admin.ModelAdmin):
    list_display = [
        "__str__",
        "product",
        "created_at",
    ]

    readonly_fields = [
        "uuid",
        "created_at",
        "updated_at",
        "deleted_at",
    ]

    def uuid_hex(self, obj):
        return obj.uuid.hex


admin.site.register(Ticket, TicketAdmin)
admin.site.register(ServiceLevelAgreement, SLAAdmin)
