// Rate limiting utility using in-memory storage
// For production, consider Redis or Vercel KV for distributed rate limiting

class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.resetTime > 0) {
        this.requests.delete(key);
      }
    }
  }

  check(identifier, maxRequests = 20, windowMs = 3600000) {
    this.cleanup();
    
    const now = Date.now();
    const userRequests = this.requests.get(identifier);

    if (!userRequests) {
      // First request from this user
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }

    // Check if window has expired
    if (now > userRequests.resetTime) {
      // Reset the counter
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }

    // Within the window
    if (userRequests.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userRequests.resetTime,
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
      };
    }

    // Increment counter
    userRequests.count++;
    this.requests.set(identifier, userRequests);

    return {
      allowed: true,
      remaining: maxRequests - userRequests.count,
      resetTime: userRequests.resetTime
    };
  }

  // Get current status without incrementing
  getStatus(identifier, maxRequests = 20) {
    const userRequests = this.requests.get(identifier);
    if (!userRequests) {
      return {
        remaining: maxRequests,
        resetTime: null
      };
    }

    const now = Date.now();
    if (now > userRequests.resetTime) {
      return {
        remaining: maxRequests,
        resetTime: null
      };
    }

    return {
      remaining: Math.max(0, maxRequests - userRequests.count),
      resetTime: userRequests.resetTime
    };
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Helper to get identifier from request
export function getIdentifier(request) {
  // Try to get IP from various headers (works with Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

// Main rate limit function
export function rateLimit(request, maxRequests, windowMs) {
  const identifier = getIdentifier(request);
  return rateLimiter.check(identifier, maxRequests, windowMs);
}

// Get status without incrementing
export function getRateLimitStatus(request, maxRequests) {
  const identifier = getIdentifier(request);
  return rateLimiter.getStatus(identifier, maxRequests);
}

export default rateLimiter;