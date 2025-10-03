export default () => ({
  PORT: process.env.PORT || 3000,

  FRONTEND_URL: process.env.FRONTEND_URL || 'frontend_url',

  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/DB_NAME',

  USER: {
    USER_PROFILE_IMAGE_URL_DEFAULT:
      process.env.USER_PROFILE_IMAGE_URL_DEFAULT ||
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || 'SHAKTIdube1234560987',
    EXPIRES: process.env.JWT_EXPIRES || '1d',
  },

  PINATA: {
    PINATA_JWT: process.env.PINATA_JWT || '',
    GATEWAY_URL:
      process.env.GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/',
  },

  BLOCKCHAIN: {
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CONTRACTS: {
      MEDIA: process.env.MEDIA_CONTRACT_ADDRESS,
      MINT: process.env.MINT_CONTRACT_ADDRESS,
      MARKET: process.env.MARKET_CONTRACT_ADDRESS,
    },
  },

  EMAIL: {
    PORT: process.env.MAILTRAP_PORT,
    HOST: process.env.MAILTRAP_HOST,
    USER: process.env.MAILTRAP_USER,
    PASS: process.env.MAILTRAP_PASS,
    FROM: process.env.MAIL_FROM,
  },

  STORAGE: {
    FILEBASE_ACCESS_KEY: process.env.FILEBASE_ACCESS_KEY,
    FILEBASE_SECRET_KEY: process.env.FILEBASE_SECRET_KEY,
    FILEBASE_BUCKET: process.env.FILEBASE_BUCKET_NAME,
  },
});
