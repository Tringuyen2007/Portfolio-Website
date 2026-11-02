import { redirect } from "next/navigation";

/** The resume now lives on the Contact & Resume page; keep old links working. */
export default function ResumePage() {
  redirect("/contact#resume");
}
