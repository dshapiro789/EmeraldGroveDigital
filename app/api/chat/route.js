import { NextResponse } from 'next/server';
import { rateLimit } from './rateLimit';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // ============================================================================
    // RATE LIMITING
    // ============================================================================
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '3600000', 10);

    const rateLimitResult = rateLimit(request, maxRequests, windowMs);

    const headers = {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    };

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': rateLimitResult.retryAfter.toString(),
          }
        }
      );
    }

    // ============================================================================
    // VALIDATE REQUEST
    // ============================================================================
    const { messages, model, stream = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400, headers }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500, headers }
      );
    }

    // ============================================================================
    // STREAMING RESPONSE (FIXED PARSER)
    // ============================================================================
    if (stream) {
      const encoder = new TextEncoder();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': 'Emerald Grove AI Playground',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'anthropic/claude-3.5-sonnet',
          messages: messages,
          temperature: 0.7,
          max_tokens: 4000,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: 'Failed to get AI response', details: errorData },
          { status: response.status, headers }
        );
      }

      // Create a ReadableStream with robust SSE parsing
      const streamResponse = new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = ''; // Buffer for incomplete chunks

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Decode and add to buffer
              buffer += decoder.decode(value, { stream: true });
              
              // Split by newlines but keep incomplete lines in buffer
              const lines = buffer.split('\n');
              
              // Keep the last line in buffer (might be incomplete)
              buffer = lines.pop() || '';

              // Process complete lines
              for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;

                if (trimmedLine.startsWith('data: ')) {
                  const data = trimmedLine.slice(6);
                  if (data === '[DONE]') continue;

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      // Send clean SSE format
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                      );
                    }
                  } catch (e) {
                    // Skip malformed JSON - this is normal for incomplete chunks
                    // They'll be completed in the next iteration
                    console.log('Skipping incomplete JSON chunk');
                  }
                }
              }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
              const trimmedLine = buffer.trim();
              if (trimmedLine.startsWith('data: ')) {
                const data = trimmedLine.slice(6);
                if (data !== '[DONE]') {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                      );
                    }
                  } catch (e) {
                    console.log('Final buffer parse error (can ignore):', e.message);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        }
      });

      return new NextResponse(streamResponse, {
        headers: {
          ...headers,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // ============================================================================
    // NON-STREAMING RESPONSE
    // ============================================================================
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'Emerald Grove AI Playground',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response', details: errorData },
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json(
      {
        message: assistantMessage,
        model: data.model,
        usage: data.usage
      },
      { headers }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}