import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUsage } from '@/lib/rate-limit';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';

    const usage = await getUsage(userId);

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Quota API error:', error);
    return NextResponse.json(
      { dailyUsed: 0, dailyLimit: 20, minuteUsed: 0, minuteLimit: 5 },
      { status: 200 }
    );
  }
}
