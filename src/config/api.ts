/**
 * Public app config only.
 * Do not place sensitive third-party secrets in the mobile bundle.
 */

type PublicAIProvider = 'mock' | 'kimi' | 'claude' | 'gpt4v';

const DIRECT_AI_PROVIDERS: PublicAIProvider[] = ['kimi', 'claude', 'gpt4v'];
const requestedProvider = process.env.EXPO_PUBLIC_AI_PROVIDER as PublicAIProvider | undefined;
const enableDirectAI = process.env.EXPO_PUBLIC_ENABLE_DIRECT_AI === 'true';
const resolvedProvider: PublicAIProvider =
  enableDirectAI && requestedProvider && DIRECT_AI_PROVIDERS.includes(requestedProvider)
    ? requestedProvider
    : 'mock';

export const API_CONFIG = {
  // Direct third-party AI from the client is disabled by default.
  KIMI_API_KEY: process.env.EXPO_PUBLIC_KIMI_API_KEY || '',
  AI_PROVIDER: resolvedProvider,
  ENABLE_DIRECT_AI: enableDirectAI,
  BACKEND_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || '',
  ENABLE_BACKEND_API:
    process.env.EXPO_PUBLIC_ENABLE_BACKEND_API === 'true' &&
    Boolean(process.env.EXPO_PUBLIC_API_BASE_URL)
};
