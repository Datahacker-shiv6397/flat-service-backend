import AWS from 'aws-sdk';

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION1,
});

// const s3 = new AWS.S3({
//   apiVersion: process.env.AWS_S3_APIVERSION,
//   endpoint: process.env.AWS_S3_ENDPOINT,
// })

export const ses = new AWS.SES();
