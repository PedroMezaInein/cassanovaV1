export function getCurrentUrl(location) {
    return location.pathname.split(/[?#]/)[0];
}

export function checkIsActive(location, url) {
    const current = getCurrentUrl(location);
    if (!current || !url) {
        return false;
    }

    if (current === url) {
        return true;
    }

    if (current.indexOf(url) > -1) {
        return true;
    }

    return false;
}

const setSingleHeader = (access_token) => {
    return{
        Authorization: `Bearer ${access_token}`,
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
}

const setSingleHeaderJson = (access_token) => {
    return{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
}

const setFormHeader = (access_token) => {
    return{
        Authorization: `Bearer ${access_token}`,
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': 'multipart/form-data'
    }

}

export { setSingleHeader, setFormHeader, setSingleHeaderJson }

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;