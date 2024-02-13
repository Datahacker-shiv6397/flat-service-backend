import sgMail from '@sendgrid/mail';
import JWt from 'jsonwebtoken';

export const getAccessToken = (email: string, phone: string) => {
  const data = {
    email,
    phone,
  };
  const accessToken = JWt.sign(
    { data },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '12h',
    }
  );
  return accessToken;
};

export const sendEmailOTP = async (otp: number, email: string) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: email,
      from: {
        name: 'FlatService',
        email: process.env.SENDGRID_SENDER_MAIL as string,
      },
      subject: 'Email Validation',
      text: `Your FlatService validation code is <strong>${otp}</strong>`,
    };
    const sent = await sgMail.send(msg);
    return sent;
  } catch (err) {
    console.log(err, 'error');
  }
  return false;
};

export const otpSendHandler = async (email: string, phone: string) => {
  // Generate new OTP of 8 digits
  const otp = Math.floor(10000000 + Math.random() * 90000000);
  // Send otp
  if (email) {
    await sendEmailOTP(otp, email);
  } else if (phone) {
    // phone otp logic will be here
  }
  return otp;
};
