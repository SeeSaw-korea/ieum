import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '203.234.214.202',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'swkim',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'ieum',
  timezone: '+09:00',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(query, params);
  return rows as T[];
}

export async function closeConnection(): Promise<void> {
  await pool.end();
}
