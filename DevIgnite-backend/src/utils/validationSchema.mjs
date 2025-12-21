export const createUserValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "must not be empty",
        },
        isString: true,
    },
    email: {
        notEmpty: {
            errorMessage: "must not be empty",
        },
        isString: true,
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: "must be minimum 8 char",
        },
        notEmpty: {
            errorMessage: "must not be empty",
        },
        isString: true,
    }
};

export const loginValidation = {
    email:{
        notEmpty: {
            errorMessage: "must not be empty",
        },
        isString: true,
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: "must be minimum 8 char",
        },
        notEmpty: {
            errorMessage: "must not be empty",
        },
        isString: true,
    }
};