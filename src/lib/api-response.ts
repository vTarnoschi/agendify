import { NextRequest, NextResponse } from "next/server";

type ApiError = {
  field: string;
  message: string;
};

export function success<T>(data?: T) {
  return NextResponse.json({ success: true, data }, { status: 200 });
}

export function created(req: Request | NextRequest, resourceId: string) {
  const { origin, pathname } = new URL(req.url);
  const location = `${origin}${pathname}/${resourceId}`;

  return new Response(null, { status: 201, headers: { location } });
}

export function error(
  message: string,
  status: number = 500,
  error?: string | { field: string; message: string }[]
) {
  return NextResponse.json({ success: false, message, error }, { status });
}

export function failure(message: string, error: ApiError[] = [], status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
}
