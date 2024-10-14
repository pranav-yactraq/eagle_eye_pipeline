require('dotenv').config();

//call this url from a browser placing proper client_id and redirect_uri ,redirect_uri needs to be whitelisted in eagle eye dashboard console for our user. 
var s = `https://auth.eagleeyenetworks.com/oauth2/authorize?scope=vms.all&client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3333/`  

console.log(s);


// call this function to request access_token and refresh_token after getting a token.
const getTokens = async (code) => {
    let endpoint = 'https://auth.eagleeyenetworks.com/oauth2/token'
    let params = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        scope: "vms.all",
        redirect_uri: `http://${hostName}:${port}`
    });

    const url = `${endpoint}?${params.toString()}`;
    try {
        const response = await axios.post(url, {}, {       
            auth: {
                username: clientId,
                password: clientSecret
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// This function will request a new access_token using the refresh token.
const refreshToken = async (refresh_token) => {
    let endpoint = 'https://auth.eagleeyenetworks.com/oauth2/token'
    let params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        scope: "vms.all"
    });
    const url = `${endpoint}?${params.toString()}`;

    try {
        const response = await axios.post(url, {}, {
            auth: {
                username: clientId,
                password: clientSecret
            }
        });
        return response.data;
    } catch (error) {
        console.log(error, "refresh token error");
        throw error;
    }
};

var fetchedCode = "";

getToken(fetchedCode);
refreshToken(process.env.REFRESH_TOKEN);


