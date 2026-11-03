import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from "react";

function Paragraph(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}

function Anchor({ href = "#", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("http")) {
    return <a href={href} rel="noreferrer" target="_blank" {...props} />;
  }

  return <Link href={href} {...props} />;
}

/** Section headings carry a short gold rule underneath, like a wooden sign's edge. */
function Heading2({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 {...props}>
      {children}
      <span aria-hidden="true" className="mt-3 block h-[var(--unit)] w-12 bg-gold" />
    </h2>
  );
}

/** Photos in prose sit in a pixel frame; the image itself is never pixelated. */
function ProseImage({ alt = "", className = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="panel mt-6 block p-[var(--unit)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- MDX authors pass arbitrary paths */}
      <img alt={alt} className={`block h-auto w-full ${className}`} loading="lazy" {...props} />
    </span>
  );
}

function HorizontalRule() {
  return <hr aria-hidden="true" className="section-rule mt-10 border-0" />;
}

export const mdxComponents = {
  p: Paragraph,
  a: Anchor,
  h2: Heading2,
  img: ProseImage,
  hr: HorizontalRule,
};
