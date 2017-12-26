module.exports = {
    HTTP: {
        CODES: {
            SUCCESS: 200,
            UPDATE: 201,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 403,
            SERVER_ERROR: 500,
        },
        METHODS: {
            POST: "post",
            GET: "get",
            DELETE: "delete",
            PUT: "put"
        }
    },
    MESSAGES: {
        SIGNUP: {
            SUCCESS: "You have successfully signed up.",
            EXIST: "User already exists.",
            ERROR: "Error no Internet Connection"

        },
        LOGIN: {
            SUCCESS: "You have successfully logged in.",
            AUTH_FAILED: "User Authentication Failed!",
            INACTIVE: "Your account is deactivated, please login again.",
            ERROR: "Error no Internet Connection"
        },
        CALC: {
            SUCCESS: "Operation successfully completed.",
            ERROR: "Operation Failed"
        },
        GENERAL: {
            FIELDS_REQUIRED: "Input fields are missing or invalid, password must be atleast 6 character only in lowercase."
        }
    }
}