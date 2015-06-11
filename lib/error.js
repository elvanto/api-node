const CATEGORY_CODE_MAP = {
    "50":  "Elvanto::Unauthorized: ",
    "100": "Elvanto::Unauthorized: ",
    "102": "Elvanto::Unauthorized: ",
    "250": "Elvanto::BadRequest: ",
    "404": "Elvanto::NotFound: ",
    "500": "Elvanto::InternalError: "
};

const HTTP_STATUS_CODES = {
    "401": "Elvanto::Unauthorized: ",
    "400": "Elvanto::BadRequest: ",
    "404": "Elvanto::NotFound: ",
    "500": "Elvanto::InternalError: "    
};

// <overview> Throws an exception if response has bad status code or response's body contains an error message. </overview>
var discoverError = function(status_code, body){
    if (body.error_description){
        handleError(status_code, body.error_description);
    }
    else if (body.error){
        handleError(body.error.code, body.error.message);
    } 
    return true;
}

var handleError = function(code, message){
    if (CATEGORY_CODE_MAP[code]){
        throw new Error(CATEGORY_CODE_MAP[code] + message);
    }
    else if(HTTP_STATUS_CODES[code]){
        throw new Error(HTTP_STATUS_CODES[code] + message);
    } 
    else {
        throw new Error(message);
    }
};

module.exports = discoverError;