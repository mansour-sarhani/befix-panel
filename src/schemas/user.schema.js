import * as Yup from 'yup';

/**
 * User Form Validation Schema
 */
export const userSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),

    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required')
        .trim()
        .lowercase(),

    password: Yup.string()
        .when('$isEdit', {
            is: false,
            then: (schema) => schema
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            otherwise: (schema) => schema
                .min(6, 'Password must be at least 6 characters')
                .notRequired(),
        }),

    role: Yup.string()
        .required('Role is required')
        .oneOf(['admin', 'manager', 'user'], 'Invalid role'),

    status: Yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive', 'suspended'], 'Invalid status'),

    phone: Yup.string()
        .nullable()
        .trim(),
});

/**
 * Initial values for create user form
 */
export const userInitialValues = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    phone: '',
};

/**
 * Get initial values for edit user form
 */
export const getUserEditInitialValues = (user) => ({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Leave empty for edit
    role: user?.role || 'user',
    status: user?.status || 'active',
    phone: user?.phone || '',
});

