import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import * as schema from './shared/schema';

/**
 * 通过 pg + drizzle-orm 直连 PostgreSQL，连接串来自 .env.local 的 DATABASE_URL。
 *
 * 注意：
 * - node-postgres 不支持 channel_binding 启动参数，需从连接串剥离，
 *   否则服务端可能返回 "unsupported startup parameter" 错误。
 * - sslmode=require 语义为「强制 SSL、不校验证书」，由显式 ssl 配置实现，
 *   避免 pg 各版本对 sslmode 解析不一致的问题。
 */
function resolvePoolConfig(): PoolConfig {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(rawUrl);
  const sslmode = url.searchParams.get('sslmode');
  const sslRequired =
    sslmode === 'require' || sslmode === 'verify-ca' || sslmode === 'verify-full';

  // 剥离 pg 无法识别的参数
  url.searchParams.delete('channel_binding');
  if (sslRequired) {
    url.searchParams.delete('sslmode');
  }

  const config: PoolConfig = { connectionString: url.toString() };
  if (sslRequired) {
    // sslmode=require 不校验证书；verify-ca / verify-full 校验证书
    config.ssl = { rejectUnauthorized: sslmode !== 'require' };
  }
  return config;
}

export const pool = new Pool(resolvePoolConfig());

export const db = drizzle(pool, { schema });
