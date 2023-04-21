const jwtDecode = require('jwt-decode');
const axios = require('axios');
const url = require('url');
const envVariables = require('../env-variables');
const keytar = require('keytar');
const os = require('os');

//to interact with the Auth0 Authorization Server.
const {apiIdentifier, auth0Domain, clientId} = envVariables;

//defines what URL Auth0 will call after finishing the authentication process
const redirectUri = 'http://localhost/callback';

const keytarService = 'electron-openid-oauth';
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;
let refreshToken = null;

function getAccessToken() {
    return accessToken;
}

function getProfile() {
    return profile;
}

//returns the complete URL of the Authorization Server that users have to visit to authenticate.
function getAuthenticationURL() {
    return ("https://" + auth0Domain + "/authorize?" + "scope=openid profile offline_access&" + "response_type=code&" + "client_id=" + clientId + "&" + "redirect_uri=" + redirectUri);
}

//verifies if there is a Refresh Token available to the current user and, if so, exchange it for a new access token.
async function refreshTokens() {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (refreshToken) {
        const refreshOptions = {
            method: 'POST',
            url: `https://${auth0Domain}/oauth/token`,
            headers: {'content-type': 'application/json'},
            data: {
                grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken,
            }
        };

        try {
            const response = await axios(refreshOptions);

            accessToken = response.data.access_token;
            profile = jwtDecode(response.data.id_token);
        } catch (error) {
            await logout();

            throw error;
        }
    } else {
        throw new Error("No available refresh token.");
    }
}

//parses the URL called back after the authentication process completes to get the code query parameter that you can use to fetch different tokens (an access token, the refresh token, and an ID token).
async function loadTokens(callbackURL) {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
        'grant_type': 'authorization_code', 'client_id': clientId, 'code': query.code, 'redirect_uri': redirectUri,
    };

    const options = {
        method: 'POST', url: `https://${auth0Domain}/oauth/token`, headers: {
            'content-type': 'application/json'
        }, data: JSON.stringify(exchangeOptions),
    };

    try {
        const response = await axios(options);

        accessToken = response.data.access_token;
        profile = jwtDecode(response.data.id_token);
        refreshToken = response.data.refresh_token;

        if (refreshToken) {
            await keytar.setPassword(keytarService, keytarAccount, refreshToken);
        }
    } catch (error) {
        await logout();

        throw error;
    }
}

//clears the local session by removing the refresh token from the disk and nullifying the
async function logout() {
    await keytar.deletePassword(keytarService, keytarAccount);
    accessToken = null;
    profile = null;
    refreshToken = null;
}

function getLogOutUrl() {
    return `https://${auth0Domain}/v2/logout`;
}

module.exports = {
    getAccessToken, getAuthenticationURL, getLogOutUrl, getProfile, loadTokens, logout, refreshTokens,
};