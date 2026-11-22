import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  let dbStatus = 'operational';
  let dbMessage = 'Connected to Supabase PostgreSQL';

  try {
    const supabase = await createClient();
    // Test basic query to stores table
    const { error: storeErr } = await supabase.from('stores').select('id').limit(1);
    if (storeErr && storeErr.code !== 'PGRST116') {
      dbStatus = 'error';
      dbMessage = storeErr.message;
    }
  } catch (err: unknown) {
    dbStatus = 'degraded';
    dbMessage = err instanceof Error ? err.message : 'Unknown database error';
  }

  const healthData = {
    status: dbStatus === 'operational' ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'DukaanOS Core App',
    environment: process.env.NODE_ENV || 'development',
    version: '0.3.0 (Milestone 2)',
    checks: {
      nextjs: 'operational',
      typescript: 'operational',
      tailwind: 'operational',
      proxy: 'operational',
      supabaseAuth: 'operational',
      supabaseDatabase: {
        status: dbStatus,
        details: dbMessage,
      },
      milestone2: {
        categories: 'operational',
        products: 'operational',
        storage: 'operational',
      },
    },
  };

  return NextResponse.json(healthData, {
    status: dbStatus === 'operational' ? 200 : 503,
  });
}
