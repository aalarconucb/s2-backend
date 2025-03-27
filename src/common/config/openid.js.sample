'use strict';

const openid = {
  issuer : 'https://account-idetest.agetic.gob.bo',
  client : {
    application_type : 'web',
    grant_types      : [
      'authorization_code',
      'refresh_token',
      'client_credentials'
    ],
    id_token_signed_response_alg : 'RS256',
    post_logout_redirect_uris    : [
      'http://localhost:8080/statics/oauth/logout.html'
    ],
    require_auth_time : false,
    response_types    : [
      'code'
    ],
    subject_type                         : 'public',
    token_endpoint_auth_method           : 'client_secret_basic',
    introspection_endpoint_auth_method   : 'client_secret_basic',
    introspection_signed_response_alg    : 'RS256',
    revocation_endpoint_auth_method      : 'client_secret_basic',
    backchannel_logout_session_required  : false,
    frontchannel_logout_session_required : false,
    request_uris                         : [],
    authorization_signed_response_alg    : 'RS256',
    web_message_uris                     : [],
    client_id_issued_at                  : 1625749055,
    client_id                            : 'vWfCvd-mRiu-AInwmbTRl',
    client_name                          : 'Pruebas',
    client_secret_expires_at             : 0,
    client_secret                        : 'mRFcTeSQbYvJeYyyUFYbSlD95ycAGABohUMUPOf4-BLi5NEv7KA5LjHPFgbnyYp0aCzTJw03v2FrhsSdiQ728A',
    contacts                             : [
      'itancara@yopmail.com'
    ],
    redirect_uris: [
      'http://localhost:8080/statics/oauth/login.html'
    ],
    registration_client_uri   : 'https://account-idetest.agetic.gob.bo/reg/vWfCvd-mRiu-AInwmbTRl',
    registration_access_token : 'G4DZvZP7mgwRWR1SLwQ9xZ4rjT8joAyun3WktcY3Eco'
  },
  client_params: {
    scope: ['openid profile fecha_nacimiento email celular offline_access']
  }
};

module.exports = openid;
