import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const redis = await createClient({ url: process.env.REDIS_URL }).connect();

export async function GET() {
  const count = await redis.get('pet-count');
  return NextResponse.json({ count: Number(count ?? 0) });
}

export async function POST() {
  const count = await redis.incr('pet-count');
  return NextResponse.json({ count });
}
