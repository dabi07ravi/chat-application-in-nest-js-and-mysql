import { registerAs } from '@nestjs/config';

export default registerAs(
    'auth',
    (): Record<string, any> => ({
        jwt: {
            accessToken: {
                secretKey:
                    process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY || '123456',
                expirationTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED
                    ? process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED
                    : 3888000000, // recommendation for production is 30m
                notBeforeExpirationTime: 0, // keep it in zero value
            },

            refreshToken: {
                secretKey:
                    process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ||
                    '123456000',
                expirationTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED
                    ? process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED
                    : 604800000, // recommendation for production is 7d
                expirationTimeRememberMe: process.env
                    .AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED
                    ? process.env.AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED
                    : 2592000000, // recommendation for production is 30d
                notBeforeExpirationTime: process.env
                    .AUTH_JWT_ACCESS_TOKEN_EXPIRED
                    ? process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED
                    : 2592000000, // recommendation for production is 30m
            },
        },

        password: {
            saltLength: 8,
            expiredInMs: 3888000000, // recommendation for production is 182 days
        },

        basicToken: {
            clientId: process.env.AUTH_BASIC_TOKEN_CLIENT_ID,
            clientSecret: process.env.AUTH_BASIC_TOKEN_CLIENT_SECRET,
        },
    })
);
