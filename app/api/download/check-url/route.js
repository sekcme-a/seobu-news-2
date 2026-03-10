// app/api/proxy-download/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) throw new Error("Source response not ok");

    const contentType = response.headers.get("content-type") || "";
    const contentLength = parseInt(
      response.headers.get("content-length") || "0",
      10,
    );

    // ✅ 수정된 체크 로직:
    // 1. 서버가 HTML을 보낸다면(에러 페이지 등) -> 차단
    if (contentType.includes("text/html")) {
      throw new Error("Server returned HTML (likely an error page)");
    }

    // 2. 파일 크기가 너무 작으면(예: 1KB 미만) -> 차단
    if (contentLength < 1000) {
      throw new Error("File too small, possibly empty");
    }

    // 3. image 타입이거나 application/octet-stream 이면 통과!
    const isAllowedType =
      contentType.includes("image") ||
      contentType.includes("application/octet-stream");

    if (!isAllowedType) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error.message);
    return NextResponse.json({ error: "Fallback to logo" }, { status: 400 });
  }
}
