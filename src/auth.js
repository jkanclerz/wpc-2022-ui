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