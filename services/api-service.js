const axios = require('axios');
const authService = require('./auth-service');

async function getPrivateData() {
    const result = await axios.get('http://localhost:8080/private', {
        headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`,
        },
    });
    return result.data;
}

module.exports = {
    getPrivateData,
}