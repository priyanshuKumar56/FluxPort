import { describe, it, expect } from 'vitest'

describe('Backend Sanity Test', () => {
  it('should verify that the math still works', () => {
    expect(2 + 2).toBe(4)
  })

  it('checks the environment', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})
