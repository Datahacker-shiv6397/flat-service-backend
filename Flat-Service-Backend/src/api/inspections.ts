import type { Request, Response } from 'express';

import InspectionsModels from '@/models/Inspection';

const addInspection = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const {
    propertyId,
    currentCondition,
    location,
    InfrastructureQuality,
    BuilderBuyerAgreements,
    additionalCharges,
    maintenance,
    waterSupplyPowerSupply,
  } = req.body;
  console.log(userId, 'userId');
  try {
    if (!propertyId) {
      return res.status(400).json({ error: 'propertyId is required' });
    }
    const findProperty = await InspectionsModels.findOne({
      propertyId,
    });
    if (findProperty) {
      return res
        .status(400)
        .json({ error: 'Inspection on this property already exists' });
    }
    const inspection = await new InspectionsModels({
      userId,
      propertyId,
      currentCondition,
      location,
      InfrastructureQuality,
      BuilderBuyerAgreements,
      additionalCharges,
      maintenance,
      waterSupplyPowerSupply,
    });
    const inspectionResult = await inspection.save();
    res.status(200).json(inspectionResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
  return false;
};

const getAllInspection = async (_req: Request, res: Response) => {
  try {
    const property = await InspectionsModels.find();
    if (property) {
      res.status(200).json(property);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const getInspectionById = async (req: Request, res: Response) => {
  const inspectionId = req.params.id;
  try {
    const inspection = await InspectionsModels.find({ _id: inspectionId });
    if (inspection) {
      res.status(200).json(inspection);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const updateInspection = async (req: Request, res: Response) => {
  const inspectionId = req.params.id;
  const {
    currentCondition,
    location,
    InfrastructureQuality,
    BuilderBuyerAgreements,
    additionalCharges,
    maintenance,
    waterSupplyPowerSupply,
  } = req.body;
  try {
    const inspection = await InspectionsModels.find({ _id: inspectionId });
    if (inspection) {
      await InspectionsModels.updateOne(
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        { _id: inspectionId },
        {
          $set: {
            currentCondition,
            location,
            InfrastructureQuality,
            BuilderBuyerAgreements,
            additionalCharges,
            maintenance,
            waterSupplyPowerSupply,
          },
        },
        { new: true }
      );
      res.status(200).json(inspection);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const deleteInspectiion = async (req: Request, res: Response) => {
  const inspectionId = req.params.id;
  try {
    const inspection = await InspectionsModels.findByIdAndDelete({
      _id: inspectionId,
    });
    if (inspection) {
      res.status(200).json({ message: 'Inspection deleted successfully' });
    } else {
      res.status(400).json({ error: 'No data Found' });
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

export default {
  addInspection,
  getAllInspection,
  getInspectionById,
  updateInspection,
  deleteInspectiion,
};
