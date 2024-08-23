from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from djangoql.admin import DjangoQLSearchMixin

from .models import Company, User

# Register your models here.


# class UserAdmin(DjangoQLSearchMixin, admin.ModelAdmin):
class UserAdmin(DjangoQLSearchMixin, BaseUserAdmin):
    search_fields = [
        "email",
        "uuid_hex",
        "username",
    ]
    list_display = (
        "username",
        "email",
        "role",
        "created_at",
    )

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "role",
                    "uuid_hex",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    readonly_fields = [
        "password",
        "uuid_hex",
        "created_at",
        "updated_at",
        "deleted_at",
    ]

    def uuid_hex(self, obj):
        return obj.uuid.hex


class CompanyAdmin(DjangoQLSearchMixin, admin.ModelAdmin):
    list_display = [
        "company",
        "created_at",
    ]

    readonly_fields = [
        "uuid_hex",
        "created_at",
        "updated_at",
        "deleted_at",
    ]

    def uuid_hex(self, obj):
        return obj.uuid.hex


admin.site.register(Company, CompanyAdmin)


admin.site.register(User, UserAdmin)
