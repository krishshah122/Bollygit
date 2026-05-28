import { ImageResponse } from "next/og";
import { getDramaById } from "@/lib/db";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  let title = "BOLLYGIT";
  let tagline = "Aapka code. Humara drama.";

  const data = await getDramaById(params.id);
  if (data) {
    title = data.title;
    tagline = data.tagline;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "radial-gradient(circle at 20% 20%, #32110f, #080608 58%)",
          color: "#f5e6c8",
          padding: 72,
          border: "18px solid #d4a017"
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, color: "#d4a017" }}>A BOLLYGIT PICTURE</div>
        <div
          style={{
            marginTop: 34,
            fontSize: 86,
            lineHeight: 0.92,
            fontWeight: 900,
            color: "#f0c040"
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 34, maxWidth: 900, fontSize: 34, fontStyle: "italic" }}>{tagline}</div>
      </div>
    ),
    size
  );
}
