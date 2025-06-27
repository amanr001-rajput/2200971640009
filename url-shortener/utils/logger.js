const axios = require('axios');


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbWFuMjIwNzc1M0BnbWFpbC5jb20iLCJleHAiOjE3NTEwMTYyODQsImlhdCI6MTc1MTAxNTM4NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIyNDNkZmIyLTU2MmUtNDBjZS1iNGYxLWUyODg1NWU4MzA0NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFtYW4gcmFqcHV0Iiwic3ViIjoiYWE4MGFjZTEtODA0MS00ZTA2LTliMWYtYWNjMDRlMDg0MzkwIn0sImVtYWlsIjoiYW1hbjIyMDc3NTNAZ21haWwuY29tIiwibmFtZSI6ImFtYW4gcmFqcHV0Iiwicm9sbE5vIjoiMjIwMDk3MTY0MDAwOSIsImFjY2Vzc0NvZGUiOiJNdWFndnEiLCJjbGllbnRJRCI6ImFhODBhY2UxLTgwNDEtNGUwNi05YjFmLWFjYzA0ZTA4NDM5MCIsImNsaWVudFNlY3JldCI6Imhld1hjUVVRVXdndUtYeFcifQ.rJlV7x0jP_yQ8cRaPf_2MyCjymkUs-0nzVjtwHKb9Qk";

const LOG_API = 'http://20.244.56.144/evaluation-service/logs';


const log = async (stack, level, pkg, message) => {
    try {
        const payload = {
            stack: stack.toLowerCase(),
            level: level.toLowerCase(),
            package: pkg.toLowerCase(),
            message
        };

        await axios.post(LOG_API, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {

    }
};

module.exports = log;