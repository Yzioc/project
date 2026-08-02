import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface GameRecord {
  id: number;
  user_id: number;
  scenario: string;
  final_score: number;
  result: 'win' | 'lose';
  played_at: string;
}

export async function saveGameRecord(
  userId: number,
  scenario: string,
  finalScore: number,
  result: 'win' | 'lose'
): Promise<GameRecord | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('game_records')
    .insert({
      user_id: userId,
      scenario,
      final_score: finalScore,
      result,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save game record:', error);
    return null;
  }

  return data as GameRecord;
}

export async function getUserGameRecords(userId: number): Promise<GameRecord[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('game_records')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch game records:', error);
    return [];
  }

  return (data || []) as GameRecord[];
}
