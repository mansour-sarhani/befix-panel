import * as Yup from 'yup';

/**
 * Login Form Validation Schema
 */
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required')
        .trim()
        .lowercase(),
    
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

/**
 * Initial values for login form
 */
export const loginInitialValues = {
    email: '',
    password: '',
};

