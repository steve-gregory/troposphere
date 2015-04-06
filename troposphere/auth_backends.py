import logging
from django.conf import settings
from caslib import OAuthClient as CAS_OAuthClient
from api.models import UserToken

from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
from uuid import uuid4

logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)

def get_or_create_user(username, profile):
    """
    :param username: string - name of the user passed in to authenticate

    :param profile: dict - includes 'firstName','lastName', 'email' - string
                                    'entitlement' - []

    :return:
    """
    user, created = User.objects.get_or_create(username=username)
    user.first_name = profile['firstName']
    user.last_name = profile['lastName']
    user.email = profile['email']
    user.is_staff = ('staff' in profile['entitlement'])
    user.save()
    return user


def generate_token(user):
    access_token = uuid4()
    user_token = UserToken.objects.create(user=user, token=access_token)
    return user_token


def create_user_token_from_cas_profile(profile, access_token):
    profile_dict = dict()
    #Parse out the OAuth list formats into a proper 'profile_dict'
    profile_dict['username'] = profile['id']
    for attr in profile['attributes']:
        key = attr.keys()[0]
        value = attr[key]
        profile_dict[key] = value

    user = get_or_create_user(profile_dict['username'], profile_dict)
    user_token = UserToken.objects.create(token=access_token, user=user)
    return user_token


class OAuthLoginBackend(object):
    """
    CAS OAuth Authentication Backend

    Exchanges an access_token for a user, creates if does not exist
    """

    def authenticate(self, access_token=None):
        try:
            user_token = UserToken.objects.get(token=access_token)

        except UserToken.DoesNotExist:
            profile = cas_oauth_client.get_profile(access_token=access_token)
            # todo: handle [profile.get('error') = 'expired_accessToken'] error
            user_token = create_user_token_from_cas_profile(profile, access_token)

        user = user_token.user
        return user

    def get_user(self, user_id):
        """
        Get a User object from the username.
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


class OAuthTokenLoginBackend(authentication.BaseAuthentication):
    """
    CAS OAuth Authentication Backend

    Exchanges an access_token for a user, creates if does not exist
    """

    def authenticate(self, request):
        access_token = None
        auth = request.META.get('HTTP_AUTHORIZATION', '').split()
        if len(auth) == 2 and auth[0].lower() == "token":
            access_token = auth[1]
        else:
            return None

        try:
            user_token = UserToken.objects.get(token=access_token)

        except UserToken.DoesNotExist:
            profile = cas_oauth_client.get_profile(access_token=access_token)
            error = profile.get('error')

            if error:
                raise exceptions.AuthenticationFailed(error)

            user_token = create_user_token_from_cas_profile(profile, access_token)

        user = user_token.user
        return (user, user_token)

class MockLoginBackend(authentication.BaseAuthentication):
    """
    AuthenticationBackend for Testing login
    (Logging in from admin or Django REST framework login)
    """
    def authenticate(self, username=None, request=None):
        """
        Return user if Always
        Return None Never.
        """
        if not username or username is not settings.ALWAYS_AUTH_USER:
            logger.info("Username of %s does not match 'ALWAYS_AUTH_USER'-- Resetting value to ALWAYS_AUTH_USER:%s"
                        % (username, settings.ALWAYS_AUTH_USER))
            username = settings.ALWAYS_AUTH_USER

        user = get_or_create_user(username, {
            'firstName':"Mocky Mock",
            'lastName':"MockDoodle",
            'email': '%s@iplantcollaborative.org' % settings.ALWAYS_AUTH_USER,
            'entitlement': []})
        return user


    def get_user(self, user_id):
        """
        Get a User object from the username.
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
