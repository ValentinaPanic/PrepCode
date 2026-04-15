import Anthropic from '@anthropic-ai/sdk'

export function getAnthropicClient(userApiKey?: string): Anthropic {
  const key = userApiKey || process.env.ANTHROPIC_API_KEY

  if (!key) {
    throw new Error('No Anthropic API key available')
  }

  return new Anthropic({ apiKey: key })
}
