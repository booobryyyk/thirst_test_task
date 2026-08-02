import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const contents = await readFile(
      join(process.cwd(), 'amplify_outputs.json'),
      'utf8'
    );

    return Response.json(JSON.parse(contents));
  } catch {
    return Response.json(
      {
        message:
          'Amplify is not configured. Run `pnpm exec ampx sandbox` or deploy the backend to generate amplify_outputs.json.',
      },
      { status: 503 }
    );
  }
}
