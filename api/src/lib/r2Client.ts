import { S3Client } from "@aws-sdk/client-s3";

export const r2 = () => {
  const r2Account = process.env.R2_ACCOUNT_ID;
  const r2AccessKey = process.env.R2_ACCESS_KEY;
  const r2SecretKey = process.env.R2_SECRET_KEY;
  const r2ApiUrl = process.env.R2_API_URL;

  if (!r2Account || !r2AccessKey || !r2SecretKey) {
    console.log("Env Var missing");
    process.exit(1);
  }

  return new S3Client({
    region: "auto",
    endpoint: r2ApiUrl,
    credentials: {
      accessKeyId: r2AccessKey,
      secretAccessKey: r2SecretKey,
    },
  });
};
