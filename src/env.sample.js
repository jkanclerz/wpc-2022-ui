export const awsConfig = {
    region: '{your_region_name}',
    bucket: '{your_bucket_name}',
    apiUrl: '{your_api_base_url}'
}

export const authConfig = {
    userPoolId: '{your_userPoolId}',
    clientId: '{your_clientId}',
    identityPoolId: '{your_identityPoolId}',
    loginName: 'cognito-idp.{region}.amazonaws.com/{user_pool_id}'
}