import { z } from 'zod'

export const ratingSchema = z.number().min(1).max(10)

export const thresholdSchema = z.number().min(1).max(10)
