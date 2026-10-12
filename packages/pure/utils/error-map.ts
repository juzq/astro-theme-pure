/**
 * Adapted to Zod 4 (Astro 7 uses Zod 4 as a dependency).
 *
 * Astro 7 ships its own `zod-error-map` (dist/core/errors/zod-error-map.js) but
 * doesn't expose or wire it up for user code, so we surface validation failures
 * by joining the default issue messages produced by Zod 4.
 */

import { AstroError } from 'astro/errors'
// `z` here refers to the Zod 4 namespace re-exported by Astro. We use it for
// the generic schema helper types (`ZodType`, `input`, `output`, `SafeParseResult`).
// Avoid importing `z` from `astro:content` — that export is deprecated in Astro 7.
import type { z } from 'astro/zod'

/**
 * Parse data with a Zod schema and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
export function parseWithFriendlyErrors<T extends z.ZodType>(
  schema: T,
  input: z.input<T>,
  message: string
): z.output<T> {
  return processParsedData(schema.safeParse(input), message)
}

/**
 * Asynchronously parse data with a Zod schema that contains asynchronous refinements or transforms
 * and throw a nicely formatted error if it is invalid.
 *
 * @param schema The Zod schema to use to parse the input.
 * @param input Input data that should match the schema.
 * @param message Error message preamble to use if the input fails to parse.
 * @returns Validated data parsed by Zod.
 */
export async function parseAsyncWithFriendlyErrors<T extends z.ZodType>(
  schema: T,
  input: z.input<T>,
  message: string
): Promise<z.output<T>> {
  return processParsedData(await schema.safeParseAsync(input), message)
}

function processParsedData<TSchema extends z.ZodType>(
  parsedData: z.ZodSafeParseResult<z.output<TSchema>>,
  message: string
): z.output<TSchema> {
  if (!parsedData.success) {
    throw new AstroError(message, formatIssues(parsedData.error.issues))
  }
  return parsedData.data
}

// Format Zod 4 issues into a readable multi-line message.
// In Zod 4 `error.issues` is an array of `$ZodIssue` objects with a `message`
// field that already reflects any default error formatting. We prepend the
// dotted path so users can locate the offending field.
function formatIssues(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>): string {
  return issues
    .map((issue) => {
      const path = issue.path.join('.')
      return path ? `**${path}**: ${issue.message}` : issue.message
    })
    .join('\n')
}