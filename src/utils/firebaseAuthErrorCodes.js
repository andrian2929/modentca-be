const firebaseAuthErrorCodes = (err) => {
  let errorMessage
  let statusCode

  switch (err.code) {
    case 'auth/admin-restricted-operation':
      errorMessage = 'ADMIN_ONLY_OPERATION'
      statusCode = 403 // Forbidden
      break
    case 'auth/argument-error':
      errorMessage = 'ARGUMENT_ERROR'
      statusCode = 400 // Bad Request
      break
    case 'auth/app-not-authorized':
      errorMessage = 'APP_NOT_AUTHORIZED'
      statusCode = 403 // Forbidden
      break
    case 'auth/app-not-installed':
      errorMessage = 'APP_NOT_INSTALLED'
      statusCode = 403 // Forbidden
      break
    case 'auth/captcha-check-failed':
      errorMessage = 'CAPTCHA_CHECK_FAILED'
      statusCode = 403 // Forbidden
      break
    case 'auth/code-expired':
      errorMessage = 'CODE_EXPIRED'
      statusCode = 400 // Bad Request
      break
    case 'auth/cordova-not-ready':
      errorMessage = 'CORDOVA_NOT_READY'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/cors-unsupported':
      errorMessage = 'CORS_UNSUPPORTED'
      statusCode = 403 // Forbidden
      break
    case 'auth/credential-already-in-use':
      errorMessage = 'CREDENTIAL_ALREADY_IN_USE'
      statusCode = 409 // Conflict
      break
    case 'auth/custom-token-mismatch':
      errorMessage = 'CREDENTIAL_MISMATCH'
      statusCode = 403 // Forbidden
      break
    case 'auth/requires-recent-login':
      errorMessage = 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN'
      statusCode = 403 // Forbidden
      break
    case 'auth/dependent-sdk-initialized-before-auth':
      errorMessage = 'DEPENDENT_SDK_INIT_BEFORE_AUTH'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/dynamic-link-not-activated':
      errorMessage = 'DYNAMIC_LINK_NOT_ACTIVATED'
      statusCode = 403 // Forbidden
      break
    case 'auth/email-change-needs-verification':
      errorMessage = 'EMAIL_CHANGE_NEEDS_VERIFICATION'
      statusCode = 403 // Forbidden
      break
    case 'auth/email-already-in-use':
      errorMessage = 'EMAIL_EXISTS'
      statusCode = 409 // Conflict
      break
    case 'auth/emulator-config-failed':
      errorMessage = 'EMULATOR_CONFIG_FAILED'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/expired-action-code':
      errorMessage = 'EXPIRED_OOB_CODE'
      statusCode = 400 // Bad Request
      break
    case 'auth/cancelled-popup-request':
      errorMessage = 'EXPIRED_POPUP_REQUEST'
      statusCode = 400 // Bad Request
      break
    case 'auth/internal-error':
      errorMessage = 'INTERNAL_ERROR'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/invalid-api-key':
      errorMessage = 'INVALID_API_KEY'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-app-credential':
      errorMessage = 'INVALID_APP_CREDENTIAL'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-app-id':
      errorMessage = 'INVALID_APP_ID'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-user-token':
      errorMessage = 'INVALID_AUTH'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-auth-event':
      errorMessage = 'INVALID_AUTH_EVENT'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-cert-hash':
      errorMessage = 'INVALID_CERT_HASH'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-verification-code':
      errorMessage = 'INVALID_CODE'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-continue-uri':
      errorMessage = 'INVALID_CONTINUE_URI'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-cordova-configuration':
      errorMessage = 'INVALID_CORDOVA_CONFIGURATION'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/invalid-custom-token':
      errorMessage = 'INVALID_CUSTOM_TOKEN'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-dynamic-link-domain':
      errorMessage = 'INVALID_DYNAMIC_LINK_DOMAIN'
      statusCode = 403 // Forbidden
      break
    case 'auth/invalid-email':
      errorMessage = 'INVALID_EMAIL'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-emulator-scheme':
      errorMessage = 'INVALID_EMULATOR_SCHEME'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/invalid-credential':
      errorMessage = 'INVALID_IDP_RESPONSE'
      statusCode = 403 // Forbidden
      break
    case 'auth/invalid-message-payload':
      errorMessage = 'INVALID_MESSAGE_PAYLOAD'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-multi-factor-session':
      errorMessage = 'INVALID_MFA_SESSION'
      statusCode = 403 // Forbidden
      break
    case 'auth/invalid-oauth-client-id':
      errorMessage = 'INVALID_OAUTH_CLIENT_ID'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-oauth-provider':
      errorMessage = 'INVALID_OAUTH_PROVIDER'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-action-code':
      errorMessage = 'INVALID_OOB_CODE'
      statusCode = 400 // Bad Request
      break
    case 'auth/unauthorized-domain':
      errorMessage = 'INVALID_ORIGIN'
      statusCode = 403 // Forbidden
      break
    case 'auth/wrong-password':
      errorMessage = 'INVALID_PASSWORD'
      statusCode = 401 // Unauthorized
      break
    case 'auth/invalid-persistence-type':
      errorMessage = 'INVALID_PERSISTENCE'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/invalid-phone-number':
      errorMessage = 'INVALID_PHONE_NUMBER'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-provider-id':
      errorMessage = 'INVALID_PROVIDER_ID'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-recipient-email':
      errorMessage = 'INVALID_RECIPIENT_EMAIL'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-sender':
      errorMessage = 'INVALID_SENDER'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-verification-id':
      errorMessage = 'INVALID_SESSION_INFO'
      statusCode = 400 // Bad Request
      break
    case 'auth/invalid-tenant-id':
      errorMessage = 'INVALID_TENANT_ID'
      statusCode = 400 // Bad Request
      break
    case 'auth/multi-factor-info-not-found':
      errorMessage = 'MFA_INFO_NOT_FOUND'
      statusCode = 404 // Not Found
      break
    case 'auth/multi-factor-auth-required':
      errorMessage = 'MFA_REQUIRED'
      statusCode = 403 // Forbidden
      break
    case 'auth/missing-android-pkg-name':
      errorMessage = 'MISSING_ANDROID_PACKAGE_NAME'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-app-credential':
      errorMessage = 'MISSING_APP_CREDENTIAL'
      statusCode = 401 // Unauthorized
      break
    case 'auth/auth-domain-config-required':
      errorMessage = 'MISSING_AUTH_DOMAIN'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/missing-verification-code':
      errorMessage = 'MISSING_CODE'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-continue-uri':
      errorMessage = 'MISSING_CONTINUE_URI'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-iframe-start':
      errorMessage = 'MISSING_IFRAME_START'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-ios-bundle-id':
      errorMessage = 'MISSING_IOS_BUNDLE_ID'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-or-invalid-nonce':
      errorMessage = 'MISSING_OR_INVALID_NONCE'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-multi-factor-info':
      errorMessage = 'MISSING_MFA_INFO'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-multi-factor-session':
      errorMessage = 'MISSING_MFA_SESSION'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-phone-number':
      errorMessage = 'MISSING_PHONE_NUMBER'
      statusCode = 400 // Bad Request
      break
    case 'auth/missing-verification-id':
      errorMessage = 'MISSING_SESSION_INFO'
      statusCode = 400 // Bad Request
      break
    case 'auth/app-deleted':
      errorMessage = 'MODULE_DESTROYED'
      statusCode = 410 // Gone
      break
    case 'auth/account-exists-with-different-credential':
      errorMessage = 'NEED_CONFIRMATION'
      statusCode = 409 // Conflict
      break
    case 'auth/network-request-failed':
      errorMessage = 'NETWORK_REQUEST_FAILED'
      statusCode = 503 // Service Unavailable
      break
    case 'auth/null-user':
      errorMessage = 'NULL_USER'
      statusCode = 500 // Internal Server Error
      break
    case 'auth/no-auth-event':
      errorMessage = 'NO_AUTH_EVENT'
      statusCode = 400 // Bad Request
      break
    case 'auth/no-such-provider':
      errorMessage = 'NO_SUCH_PROVIDER'
      statusCode = 400 // Bad Request
      break
    case 'auth/operation-not-allowed':
      errorMessage = 'OPERATION_NOT_ALLOWED'
      statusCode = 403 // Forbidden
      break
    case 'auth/operation-not-supported-in-this-environment':
      errorMessage = 'OPERATION_NOT_SUPPORTED'
      statusCode = 501 // Not Implemented
      break
    case 'auth/popup-blocked':
      errorMessage = 'POPUP_BLOCKED'
      statusCode = 403 // Forbidden
      break
    case 'auth/popup-closed-by-user':
      errorMessage = 'POPUP_CLOSED_BY_USER'
      statusCode = 400 // Bad Request
      break
    case 'auth/provider-already-linked':
      errorMessage = 'PROVIDER_ALREADY_LINKED'
      statusCode = 409 // Conflict
      break
    case 'auth/quota-exceeded':
      errorMessage = 'QUOTA_EXCEEDED'
      statusCode = 429 // Too Many Requests
      break
    case 'auth/redirect-cancelled-by-user':
      errorMessage = 'REDIRECT_CANCELLED_BY_USER'
      statusCode = 400 // Bad Request
      break
    case 'auth/redirect-operation-pending':
      errorMessage = 'REDIRECT_OPERATION_PENDING'
      statusCode = 400 // Bad Request
      break
    case 'auth/rejected-credential':
      errorMessage = 'REJECTED_CREDENTIAL'
      statusCode = 403 // Forbidden
      break
    case 'auth/second-factor-already-in-use':
      errorMessage = 'SECOND_FACTOR_ALREADY_ENROLLED'
      statusCode = 409 // Conflict
      break
    case 'auth/maximum-second-factor-count-exceeded':
      errorMessage = 'SECOND_FACTOR_LIMIT_EXCEEDED'
      statusCode = 409 // Conflict
      break
    case 'auth/tenant-id-mismatch':
      errorMessage = 'TENANT_ID_MISMATCH'
      statusCode = 400 // Bad Request
      break
    case 'auth/unauthorized-continue-uri':
      errorMessage = 'UNAUTHORIZED_CONTINUE_URI'
      statusCode = 403 // Forbidden
      break
    case 'auth/user-cancelled':
      errorMessage = 'USER_CANCELLED'
      statusCode = 400 // Bad Request
      break
    case 'auth/user-not-found':
      errorMessage = 'USER_NOT_FOUND'
      statusCode = 404 // Not Found
      break
    case 'auth/user-disabled':
      errorMessage = 'USER_DISABLED'
      statusCode = 403 // Forbidden
      break
    case 'auth/user-mismatch':
      errorMessage = 'USER_MISMATCH'
      statusCode = 403 // Forbidden
      break
    case 'auth/weak-password':
      errorMessage = 'WEAK_PASSWORD'
      statusCode = 400 // Bad Request
      break
    default:
      errorMessage = 'UNKNOWN_ERROR'
      statusCode = 500 // Internal Server Error
      break
  }

  return { errorMessage, statusCode }
}

module.exports = firebaseAuthErrorCodes
