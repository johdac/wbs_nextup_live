export const getPublicFileUrl = (key: string | null | undefined) => {
  const cdnUrl = process.env.CDN_URL;
  if (!cdnUrl) {
    console.log("Missing env var CDN_URL");
    process.exit(1);
  }
  if (key) return `${cdnUrl}/${key}`;
  else return undefined;
};
