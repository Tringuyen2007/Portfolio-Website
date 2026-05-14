import { ImageResponse } from "next/og";

import { getProjectBySlug } from "@/lib/content/projects";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ProjectImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: ProjectImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#14161A",
          color: "#E6E7E9",
          padding: "56px",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 460px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            color: "#9BA1A8",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 54,
              height: 54,
              borderRadius: 999,
              border: "1px solid #2A2D31",
              alignItems: "center",
              justifyContent: "center",
              color: "#E6E7E9",
            }}
          >
            TN
          </div>
          Project case study
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              lineHeight: 1,
              fontWeight: 700,
              maxWidth: "950px",
            }}
          >
            {project?.title ?? "Project"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              lineHeight: 1.45,
              maxWidth: "920px",
              color: "#C7CBD1",
            }}
          >
            {project?.summary ?? "A calm, deliberate software case study."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {(project?.stack ?? ["Next.js", "TypeScript"]).slice(0, 4).map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid #2A2D31",
                color: "#9BA1A8",
                fontSize: 24,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
