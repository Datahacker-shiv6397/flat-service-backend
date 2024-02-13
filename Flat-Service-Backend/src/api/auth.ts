import * as bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { getAccessToken, otpSendHandler } from '../lib/helpers';
import UserModels from '../models/User';

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, role } = req.body;
  if (!password) {
    res.status(400).json({ error: 'All fields are required' });
  }
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password can't be shorter than 8 characters" });
  }
  // check User Exists or not
  const userExists = await UserModels.find({
    $or: [
      { email: { $regex: `${email}`, $options: 'i' } },
      { phone: { $regex: `${phone}`, $options: 'i' } },
    ],
  });
  if (userExists.length > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }
  try {
    if (email || phone) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = await otpSendHandler(email, phone);
      const user = await new UserModels({
        _id: new mongoose.Types.ObjectId(),
        role,
        firstName,
        lastName,
        email: email || '',
        phone: phone || '',
        password: hashedPassword,
        otp: {
          emailOTP: email ? otp : '',
          phoneOTP: phone ? otp : '',
        },
      });
      const userResult = await user.save();
      res
        .status(200)
        .json({ message: 'otp has sent to your email or phone', userResult });
    } else {
      res.status(400).json({ error: 'email or phone is required' });
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
  }
  try {
    const checkUserExists = await UserModels.find({
      $or: [
        { email: { $regex: `${email}`, $options: 'i' } },
        { phone: { $regex: `${phone}`, $options: 'i' } },
      ],
    });
    if (checkUserExists.length > 0) {
      if (
        checkUserExists[0]?.verification.isEmailVerified ||
        checkUserExists[0]?.verification.isPhoneVerified
      ) {
        const validatedUser = await bcrypt.compare(
          password,
          checkUserExists[0]?.password as string
        );
        if (!validatedUser) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
        const accessToken = await getAccessToken(email, phone);
        res.status(200).json(accessToken);
      } else {
        return res
          .status(400)
          .json({ error: 'please verify your account to login' });
      }
    } else {
      return res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const verifyOtp = async (req: Request, res: Response) => {
  const { otp, password, email, phone } = req.body;
  if (!otp) {
    return res.status(400).json({ error: 'Otp is required' });
  }
  if (email || phone) {
    const findUserEmailorPhone = await UserModels.findOne({
      $or: [{ email }, { phone }],
    });
    if (findUserEmailorPhone) {
      if (
        (findUserEmailorPhone?.otp.emailOTP ||
          findUserEmailorPhone?.otp.phoneOTP) !== otp
      ) {
        return res.status(400).json({ error: "Otp didn't match" });
      }
    } else {
      return res.status(400).json({ error: 'User not found' });
    }
    // const findOtpInDb = await UserModels.findOne({
    //   $or: [{ 'otp.emailOTP': otp }, { 'otp.phoneOTP': otp }],
    // });
    // if ((findOtpInDb?.otp.emailOTP || findOtpInDb?.otp.phoneOTP) !== otp) {
    //   return res.status(400).json({ error: "Otp didn't match" });
    // }
    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password can't be shorter than 8 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModels.updateOne(
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        { _id: findUserEmailorPhone?._id },
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );
    }
    if (findUserEmailorPhone?.otp.emailOTP) {
      await UserModels.updateOne(
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        { _id: findUserEmailorPhone._id },
        {
          $set: {
            'verification.isEmailVerified': true,
          },
        },
        { new: true }
      );
    } else {
      await UserModels.updateOne(
        { _id: findUserEmailorPhone?._id },
        {
          $set: {
            'verification.isPhoneVerified': true,
          },
        },
        { new: true }
      );
    }
    return res.status(200).json({ message: 'otp verified successfully' });
  }
  return res.status(400).json({ error: 'email or phone is required' });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email, phone } = req.body;
  if (email || phone) {
    const sendOtp = await otpSendHandler(email, phone);
    const findUser = await UserModels.findOne({
      $or: [{ email }, { phone }],
    });
    if (findUser) {
      await UserModels.updateOne(
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        { _id: findUser._id },
        {
          $set: {
            'otp.emailOTP': findUser.email ? sendOtp : '',
            'otp.phoneOTP': findUser.phone ? sendOtp : '',
          },
        },
        { new: true }
      );
    } else {
      return res.status(400).json({ error: 'Email or phone not exists' });
    }
  } else {
    return res.status(400).json({ error: 'Email or phone is required' });
  }
  return res.status(200).json({ message: 'otp sent to your email or phone' });
};

const resendOtp = async (req: Request, res: Response) => {
  const { email, phone } = req.body;
  try {
    if (email || phone) {
      const otp = await otpSendHandler(email, phone);
      const findUser = await UserModels.findOne({
        $or: [{ email }, { phone }],
      });
      if (findUser?.email) {
        await UserModels.updateOne(
          { _id: findUser?._id },
          {
            $set: {
              'otp.emailOTP': otp,
            },
          },
          { new: true }
        );
      } else {
        await UserModels.updateOne(
          { _id: findUser?._id },
          {
            $set: {
              'otp.phoneOTP': otp,
            },
          },
          { new: true }
        );
      }
      res.status(200).json({ message: 'otp has sent to your email or phone' });
    } else {
      res.status(400).json({ error: 'email or phone is required' });
    }
  } catch (error) {
    console.log(error);
  }
};

export default { register, login, verifyOtp, resendOtp, forgotPassword };
