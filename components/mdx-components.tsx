import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

function Paragraph(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}

function Anchor({ href = "#", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("http")) {
    return <a href={href} rel="noreferrer" target="_blank" {...props} />;
  }

  return <Link href={href} {...props} />;
}

export const mdxComponents = {
  p: Paragraph,
  a: Anchor,
};
