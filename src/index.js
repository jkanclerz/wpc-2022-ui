import {hello} from './hello';
import { awsConfig, authConfig } from './env';

import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const myFirstActionBtn = document.querySelector('.myFirstActionBtn');
myFirstActionBtn.addEventListener('click', hello);

const listBucketsBtn = document.querySelector('.listBucketsBtn');
listBucketsBtn.addEventListener('click', () => listMyBuckets());

import { S3Client, ListObjectsV2Command} from "@aws-sdk/client-s3";
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'


const getToken = () => {
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser == null) {
            reject('user not authorized');
        }
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
            }
            resolve(session
                .getIdToken()
                .getJwtToken());
        })
    })
}
const getCredentials = (token) => {
    return fromCognitoIdentityPool({
        clientConfig: {region: awsConfig.region},
        identityPoolId: authConfig.identityPoolId,
        logins: {
            [authConfig.loginName]: token
        }
    });
}
const getAuthenticatedS3Client = (credentials) => {
    const s3 = new S3Client({
        region: awsConfig.region,
        credentials: credentials
    });

    return s3;
}

const listMyBuckets = async () => {
    const s3 = await getToken()
        .then(token => getCredentials(token))
        .then(credentials => getAuthenticatedS3Client(credentials))
        .catch(err => console.log(':(((('))

    const listObjectsParams = {
        Bucket: awsConfig.bucket
    };
    s3.send(new ListObjectsV2Command(listObjectsParams))
        .then(response => response.Contents)
        .then(filesObjects => filesObjects.map(file => file.Key))
        .then(names => console.log(names));
}

const registerData = {
    email: "daphney51@10minut.xyz",
    pw: "daphney51@10minut.xyz",
    website: "jkan.pl"
}

const confirmData = {
    email: "daphney51@10minut.xyz",
    code: '1234567'
}

const loginData = {
    email: registerData.email,
    pw: registerData.pw
}

const userPool = new CognitoUserPool({
    UserPoolId: authConfig.userPoolId,
    ClientId: authConfig.clientId,
});
///// User Related
const register = (registerRequest) => {
    //return new Promise((resolve, reject) => {
    //   console.log('i am going to login');
    //    resolve("userId: xyz");
    //});
    return new Promise((resolve, reject) => {
        userPool.signUp(
            registerRequest.email,
            registerRequest.pw,
            [
                new CognitoUserAttribute({Name: "website", Value: registerRequest.website})
            ],
            null,
            (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result);
            }
        )
    });
}

const confirm = (confirmRequest) => {}

const login = (loginRequest) => {
    const authDetails = new AuthenticationDetails({
        Username: loginRequest.email,
        Password: loginRequest.pw
    });
    const cognitoUser = new CognitoUser({
        Username: loginRequest.email,
        Pool: userPool
    });
    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                resolve(result);
            },
            onFailure: (err) => {
                reject(err)
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                delete userAttributes.email_verified;
                delete userAttributes.email;
                userAttributes.website = "jkan.pl";
                console.log(userAttributes);
                cognitoUser.completeNewPasswordChallenge(loginRequest.pw, userAttributes);
            }
        })
    });
}



const loginBtn = document.querySelector('.loginBtn');
loginBtn.addEventListener('click', () => {
    login(loginData)
        .then(() => console.log('success'))
        .catch((err) => console.log(err)); 
});













const registerBtn = document.querySelector('.registerBtn');
registerBtn.addEventListener('click', () => {
    register(registerData)
        .then(result => console.log(result))
        .catch((err) => console.log(err));

});

const confirmBtn = document.querySelector('.confirmBtn');
confirmBtn.addEventListener('click', () => {
    confirm(confirmData)
        .then(result => console.log(result))
        .catch((err) => console.log(err));
});
