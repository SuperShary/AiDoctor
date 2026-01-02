import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (supabase) return supabase;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
}

export interface RewriteResponse {
    content: string;
    error?: string;
}

export async function rewriteCV(
    resumeText: string,
    jobDescription: string
): Promise<RewriteResponse> {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.functions.invoke('rewrite-cv', {
            body: { resumeText, jobDescription },
        });

        if (error) {
            console.error('Supabase function error:', error);
            return { content: '', error: error.message };
        }

        return { content: data.content };
    } catch (error) {
        console.error('Error calling rewrite function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the AI service. Please try again.';
        return {
            content: '',
            error: errorMessage
        };
    }
}
