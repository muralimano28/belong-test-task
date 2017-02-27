const baseUrl = "https://api.github.com/";

export default {
    'baseUrl': baseUrl,
    'repos': (username) => {
       return baseUrl + "users/" + username + "/repos";
    }
}
