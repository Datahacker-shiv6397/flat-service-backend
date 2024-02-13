import type { Request, Response } from 'express';

import UserModels from '../models/User';

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const user = await UserModels.find().select('-password -otp');
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
  return false;
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModels.findById(req.params.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
    }
    const updatedData = await user?.save();
    res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
  return false;
};

export default { getAllUsers, updateUser };
