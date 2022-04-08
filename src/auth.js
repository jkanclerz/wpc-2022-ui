import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'

export const getCredentials = (token) => {
    return fromCognitoIdentityPool({
        clientConfig: {region: awsConfig.region},
        identityPoolId: authConfig.identityPoolId,
        logins: {
            [authConfig.loginName]: token
        }
    });
}

export const getCurrentUserId = async () => {
    const credentials = await getToken()
        .then(token => getCredentials(token))
        .then(cred => cred())
    ;

    return credentials.identityId;
} 