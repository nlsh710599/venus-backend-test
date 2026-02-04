import dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
  port: number;
  db: {
    host: string;
    user: string;
    password: string;
    name: string;
    port: number;
  };
}

const getEnvVar = (name: string, fallback?: string): string => {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return value;
};

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '8181', 10),
  db: {
    host: getEnvVar('DB_HOST', 'db'),
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    name: getEnvVar('DB_NAME'),
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
};
