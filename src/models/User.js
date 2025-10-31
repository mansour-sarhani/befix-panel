import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password in query results by default
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'user'],
            default: 'user',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        phone: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: '',
        },
        preferences: {
            emailNotifications: {
                type: Boolean,
                default: true,
            },
            pushNotifications: {
                type: Boolean,
                default: true,
            },
            notificationFrequency: {
                type: String,
                enum: ['immediate', 'daily', 'weekly'],
                default: 'immediate',
            },
            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },
            language: {
                type: String,
                default: 'en',
            },
            dateFormat: {
                type: String,
                default: 'MM/DD/YYYY',
            },
            profileVisibility: {
                type: String,
                enum: ['public', 'private'],
                default: 'public',
            },
        },
        lastPasswordChange: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        accountDeactivatedAt: {
            type: Date,
            default: null,
        },
        accountDeletedAt: {
            type: Date,
            default: null,
        },
        dataExportRequests: [
            {
                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
                exportedAt: {
                    type: Date,
                    default: null,
                },
                format: {
                    type: String,
                    enum: ['json', 'csv'],
                    default: 'json',
                },
            },
        ],
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                // Remove password and version from JSON output
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

/**
 * Pre-save middleware to hash password before saving
 * Only runs when password is modified
 */
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt with 10 rounds (good balance of security and performance)
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare provided password with hashed password in database
 * @param {string} candidatePassword - Plain text password to check
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // this.password is the hashed password from database
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Method to update last login timestamp
 */
UserSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return await this.save();
};

/**
 * Static method to find user by email with password field included
 * @param {string} email - User email
 * @returns {Promise<Document>} User document with password field
 */
UserSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email }).select('+password');
};

// Prevent model recompilation in development (Next.js hot reload)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

