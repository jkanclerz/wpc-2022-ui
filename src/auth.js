import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'
import { awsConfig, authConfig } from './env';


export const getCredentials = (token) => {
    return fromCognitoIdentityPool({
        clientConfig: {region: awsConfig.region},
        identityPoolId: authConfig.identityPoolId,
        logins: {
            [authConfig.loginName]: token
        }
    });
}
