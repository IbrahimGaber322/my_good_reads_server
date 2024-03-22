import dotenv from "dotenv";
dotenv.config();

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const JWT_SECRET = process.env.JWT_SECRET;
export const FRONT_URL = process.env.FRONT_URL;
export const PORT = process.env.PORT;
export const DB = process.env.DB;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const API_ENVIROMENT_VARIABLE = process.env.API_ENVIROMENT_VARIABLE;
