import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#0a0e24",
          color: "#f3ead6",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#161a2f",
            border: "8px solid #4a4f80",
            boxShadow: "inset 0 8px 0 #2b3058",
            padding: "48px 56px",
          }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 24,
            color: "#e9b63a",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              border: "4px solid #4a4f80",
              background: "#0a0e24",
              alignItems: "center",
              justifyContent: "center",
              color: "#f3ead6",
              fontWeight: 700,
            }}
          >
            TN
          </div>
          Personal website
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              lineHeight: 1,
              fontWeight: 700,
              maxWidth: "980px",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.45,
              maxWidth: "920px",
              color: "#c9c1ad",
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {siteConfig.skills.slice(0, 4).map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "10px 18px",
                border: "4px solid #4a4f80",
                background: "#0a0e24",
                color: "#f3ead6",
                fontSize: 22,
              }}
            >
              {item}
            </div>
          ))}
        </div>
        </div>
      </div>
    ),
    size,
  );
}
