// Follow this setup guide to integrate the Deno runtime into your application:
// https://supabase.com/docs/guides/functions

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from "https://deno.land/x/openai@v4.47.1/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY')!,
})

const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume optimizer and professional resume writer with years of experience helping candidates land interviews at top companies.

TASK: Analyze the provided resume and job description, then rewrite the resume to maximize ATS compatibility and relevance to the target position.

INSTRUCTIONS:
1. Extract key skills, qualifications, and keywords from the job description
2. Identify matching experiences in the resume that align with these requirements
3. Rewrite bullet points using the STAR method (Situation, Task, Action, Result)
4. Incorporate relevant keywords naturally throughout the content
5. Quantify achievements with metrics where possible (percentages, numbers, dollar amounts)
6. Use strong action verbs at the beginning of each bullet point
7. Maintain professional tone and clear, concise language

CRITICAL RULES:
- NEVER invent experiences, skills, or qualifications the candidate doesn't have
- Only reframe and highlight existing experiences to match the JD
- Preserve all contact information and section structure
- Keep the resume focused and scannable
- Ensure keywords appear in context, not just stuffed in

OUTPUT FORMAT:
Return the optimized resume in clean Markdown format with the following sections:
# [Candidate Name]
## Professional Summary
## Work Experience
## Skills
## Education
(Include other relevant sections if present in original)`

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { resumeText, jobDescription } = await req.json()

        if (!resumeText || !jobDescription) {
            return new Response(
                JSON.stringify({ error: 'Missing resumeText or jobDescription' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `RESUME:\n${resumeText}\n\n---\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        })

        const rewrittenContent = completion.choices[0]?.message?.content || ''

        return new Response(
            JSON.stringify({ content: rewrittenContent }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    } catch (error) {
        console.error('Error processing request:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to process resume. Please try again.' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
