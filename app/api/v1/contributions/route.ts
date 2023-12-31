import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const response = await fetch(`https://github-contributions.vercel.app/api/v1/${searchParams.get('name')}`)
    .then(resp => resp.json());
  return NextResponse.json(
    response,
    {
      status: 200,
    },
  );
}