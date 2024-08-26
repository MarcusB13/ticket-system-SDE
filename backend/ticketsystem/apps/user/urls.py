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
            r"^signup/$",
            views.SignUpView.as_view(),
            name="signup_view",
        )
    )

    urls.append(
        re_path(
            r"^login/$",
            views.LoginView.as_view(),
            name="login_view",
        )
    )

    urls.append(
        re_path(
            r"^update/$",
            views.UpdateUseView.as_view(),
            name="update_user_view",
        )
    )

    urls.append(
        re_path(
            r"^check-token/$",
            views.CheckUerTokenView.as_view(),
            name="check_token_view",
        )
    )

    urls.append(
        re_path(
            r"^current/$",
            views.GetUerView.as_view(),
            name="get_user_view",
        )
    )

    urls.append(
        re_path(
            r"^all/$",
            views.GetUsersView.as_view(),
            name="get_users_view",
        )
    )

    return urls


urlpatterns = [
    re_path(r"^", include(get_urls())),
]
