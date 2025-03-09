import { config } from "dotenv";

config();

export const enum PREFIX {
    CTP = 'CTP',
    DEV = 'DEV',
    IMPORT = 'IMPORT',
    EXPORT = 'EXPORT',
    ME = 'ME',
    STORE = 'STORE',
}

export const getConfig = (prefix: string) => {

    const x ={
        projectKey: process.env.NEXT_PUBLIC_CTP_PROJECT_KEY ?? '',
        clientID: process.env.NEXT_PUBLIC_CTP_CLIENT_ID ?? '',
        clientSecret: process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET ?? '',
        scopes: process.env.NEXT_PUBLIC_CTP_SCOPES ?? '',
        apiUrl: process.env.NEXT_PUBLIC_CTP_API_URL ?? '',
        authUrl: process.env.NEXT_PUBLIC_CTP_AUTH_URL ?? ''
    }
    // alert(JSON.stringify(x))
    return x
}