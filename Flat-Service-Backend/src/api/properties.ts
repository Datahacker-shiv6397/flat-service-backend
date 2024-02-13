import type { Request, Response } from 'express';

import PropertyModels from '@/models/Properties';

const addProperty = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { address } = req.body;
  try {
    const property = await new PropertyModels({
      userId,
      address,
    });
    const propertyResult = await property.save();
    res.status(200).json(propertyResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
  return false;
};

const getAllProperty = async (_req: Request, res: Response) => {
  try {
    const property = await PropertyModels.find({});
    if (property) {
      res.status(200).json(property);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const getPropertyById = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  try {
    const property = await PropertyModels.find({ _id: propertyId });
    if (property) {
      res.status(200).json(property);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const updateProperty = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const { address } = req.body;
  try {
    const property = await PropertyModels.find({ _id: propertyId });
    if (property) {
      await PropertyModels.updateOne(
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        { _id: propertyId },
        {
          $set: {
            address,
          },
        },
        { new: true }
      );
      res.status(200).json(property);
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const deleteProperty = async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  try {
    const property = await PropertyModels.findByIdAndDelete({
      _id: propertyId,
    });
    if (property) {
      res.status(200).json({ message: 'Property deleted successfully' });
    } else {
      res.status(400).json({ error: 'No data Found' });
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

export default {
  addProperty,
  getAllProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
