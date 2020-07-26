import * as dotenv from 'dotenv';

dotenv.config();

// For environment specific config
// let path;
// switch (process.env.NODE_ENV) {
//   case "test":
//     path = `${__dirname}/../../.env.test`;
//     break;
//   case "production":
//     path = `${__dirname}/../../.env.production`;
//     break;
//   default:
//     path = `${__dirname}/../../.env.development`;
// }
// dotenv.config({ path: path });

export const LOG_LEVEL = process.env.LOG_LEVEL;
export const TABLE_SIZE = process.env.TABLE_SIZE;
