from django.urls import include, path, re_path
from rest_framework import routers

router = routers.DefaultRouter()

from . import views


def get_urls():
    """Append custom urls"""
    urls = router.urls

    # Get all groups for the user or create a new group
    urls.append(
        re_path(
            r"^all/$",
            views.GetTicketsView.as_view(),
            name="tickets_view",
        )
    )

    urls.append(
        re_path(
            r"^create/$",
            views.TicketView.as_view(),
            name="tickets_view",
        )
    )

    urls.append(
        re_path(
            r"^details/$",
            views.GetTicketDetailsView.as_view(),
            name="tickets_view",
        )
    )

    urls.append(
        re_path(
            r"^my-tickets/$",
            views.GetMyTicketsView.as_view(),
            name="my_ticket_view",
        )
    )

    urls.append(
        re_path(
            r"^companies/$",
            views.CompaniesView.as_view(),
            name="companies_view",
        )
    )

    urls.append(
        re_path(
            r"^(?P<ticket_uuid>\w+)/$",
            views.SingleTicketView.as_view(),
            name="ticket_view",
        )
    )

    return urls


urlpatterns = [
    re_path(r"^", include(get_urls())),
]
