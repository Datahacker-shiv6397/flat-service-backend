import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Property {
  userId: string;
  address: any;
}

export interface PropertyModel extends Property, Document {}

const PropertySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    address: [
      {
        name: {
          type: String,
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        landmark: {
          type: String,
          require: true,
        },
        flatno: {
          type: String,
          require: true,
        },
      },
    ],
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const PropertyModels = mongoose.model<PropertyModel>(
  'property',
  PropertySchema
);
export default PropertyModels;

// area
