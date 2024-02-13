import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Inspection {
  propertyId: string;
  currentCondition: string;
  additionalCharges: number;
  maintenance: number;
  waterSupply: string;
  powerSupply: string;
}

export interface InspectionModel extends Inspection, Document {}

const InspectionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Properties',
      required: true,
    },
    location: {
      type: Boolean,
      required: false,
    },
    currentCondition: {
      type: Boolean,
      required: false,
    },
    InfrastructureQuality: {
      type: Boolean,
      required: false,
    },
    BuilderBuyerAgreements: {
      type: Boolean,
      required: false,
    },
    additionalCharges: {
      type: Boolean,
      required: false,
    },
    maintenance: {
      type: Boolean,
      required: false,
    },
    waterSupplyPowerSupply: {
      type: Boolean,
      required: false,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const InspectionsModels = mongoose.model<InspectionModel>(
  'Inspections',
  InspectionSchema
);
export default InspectionsModels;

// area
