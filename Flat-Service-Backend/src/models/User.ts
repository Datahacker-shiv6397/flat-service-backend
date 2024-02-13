import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  otp: any;
  verification: any;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    role: {
      type: String,
      enum: ['ADMINSTRATOR', 'USER'],
      default: 'USER',
      required: false,
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    otp: {
      emailOTP: {
        type: Number,
        required: false,
        default: null,
      },
      phoneOTP: {
        type: Number,
        required: false,
        default: null,
      },
    },
    verification: {
      isEmailVerified: {
        type: Boolean,
        default: false,
        required: true,
      },
      isPhoneVerified: {
        type: Boolean,
        default: false,
        required: true,
      },
    },

    Inspections: [
      {
        InspectionId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        name: {
          type: String,
        },
        status: {
          type: String,
        },
      },
    ],
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModels = mongoose.model<UserModel>('user', UserSchema);
export default UserModels;
