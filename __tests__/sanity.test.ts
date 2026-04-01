import { describe, it, expect } from 'vitest'

describe('Basic Test Suite', () => {
  it('should pass a sanity check', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have environment variables configured', () => {
    expect(typeof process.env.NODE_ENV).toBe('string')
  })
})
