import { Breadcrumb } from "@/components/Breadcrumb";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";

export default function AcademyPage() {
  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      <header
        className="flex shrink-0 items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "#1c1c1c" }}
      >
        <Breadcrumb />
        <div className="flex items-center gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>
      <div className="flex-1 p-6" />
    </main>
  );
}
