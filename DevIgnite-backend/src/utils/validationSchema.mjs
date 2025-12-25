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

export const tokenValidationSchema = {
    token: {
        notEmpty: {
            errorMessage: "Token is required",
        },
        isString: true,
        trim: true,
    }
}

export const postValidationSchema = {
    content: {
        notEmpty: {
            errorMessage: "Post must not be empty",
        },
        isString: true,
    },
    image: {
        optional: true,
        isString: true,
    },
    department: {
        notEmpty: {
            errorMessage: "Department is required",
        },
        isString: true,
        isIn: {
            options: [["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"]],
            errorMessage: "Department must be one of DEV, UIUX, DESIGN, HR, COM, RELV",
        },
    }
}

