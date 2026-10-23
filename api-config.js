// Set this to the public URL of the deployed Express API, without a trailing slash.
// Leave empty only when the website and API are served from the same origin.
window.JSS_API_BASE_URL = '';

window.jssApiUrl = (path) => `${window.JSS_API_BASE_URL.replace(/\/+$/, '')}${path}`;
