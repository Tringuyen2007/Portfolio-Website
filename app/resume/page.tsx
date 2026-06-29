import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Resume",
  description: "Tri Nguyen's technical resume.",
  alternates: {
    canonical: "/resume",
  },
};

const images = [
  "/images/DJI_20260508125046_0074_D (1) 2.JPG",
  "/images/DJI_20260508202200_0128_D 2.JPG",
  "/images/IMG_0750.JPG",
  "/images/IMG_1002.jpg",
  "/images/IMG_1463.JPG",
  "/images/IMG_1464.JPG",
  "/images/IMG_1770.jpg",
  "/images/IMG_1998.PNG",
];

const boxes = [
  { width: 120, height: 120, top: "8%",  left: "5%",  duration: "7s",   delay: "0s",   rotStart: "-10deg", rotEnd: "15deg"  },
  { width: 80,  height: 80,  top: "15%", left: "88%", duration: "9s",   delay: "1.5s", rotStart: "20deg",  rotEnd: "-5deg"  },
  { width: 200, height: 160, top: "35%", left: "2%",  duration: "11s",  delay: "0.5s", rotStart: "-20deg", rotEnd: "10deg"  },
  { width: 100, height: 100, top: "60%", left: "90%", duration: "6s",   delay: "3s",   rotStart: "5deg",   rotEnd: "-25deg" },
  { width: 150, height: 130, top: "80%", left: "12%", duration: "8s",   delay: "2s",   rotStart: "-15deg", rotEnd: "20deg"  },
  { width: 90,  height: 90,  top: "5%",  left: "50%", duration: "10s",  delay: "4s",   rotStart: "30deg",  rotEnd: "-10deg" },
  { width: 180, height: 180, top: "70%", left: "55%", duration: "12s",  delay: "1s",   rotStart: "-5deg",  rotEnd: "25deg"  },
  { width: 110, height: 140, top: "45%", left: "75%", duration: "7.5s", delay: "2.5s", rotStart: "15deg",  rotEnd: "-20deg" },
  { width: 220, height: 120, top: "25%", left: "35%", duration: "9.5s", delay: "0.8s", rotStart: "-25deg", rotEnd: "5deg"   },
  { width: 70,  height: 70,  top: "88%", left: "70%", duration: "5.5s", delay: "3.5s", rotStart: "10deg",  rotEnd: "-30deg" },
];

export default function ResumePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {boxes.map((box, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: box.width,
              height: box.height,
              top: box.top,
              left: box.left,
              "--rot-start": box.rotStart,
              "--rot-end": box.rotEnd,
              animation: `float ${box.duration} ease-in-out ${box.delay} infinite`,
              borderRadius: "8px",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={images[i % images.length]}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 py-12">
        <iframe
          src="/Tri_technical_resume.pdf"
          className="w-full rounded-lg border border-border"
          style={{ height: "85vh" }}
          title="Resume"
        />
      </div>
    </div>
  );
}
