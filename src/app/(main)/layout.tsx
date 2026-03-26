import { ContentWrapper } from "@/components/ContentWrapper";
import { FolderProvider } from "@/contexts/FolderContext";
import { SpotlightProvider } from "@/contexts/SpotlightContext";
import { CreateModalProvider } from "@/contexts/CreateModalContext";
import { ToolProvider } from "@/contexts/ToolContext";
import { PaletteProvider } from "@/contexts/PaletteContext";
import { AssistantPanelProvider } from "@/contexts/AssistantPanelContext";
import { AssetsFilterProvider } from "@/contexts/AssetsFilterContext";
import { NewProjectModalProvider } from "@/contexts/NewProjectModalContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FolderProvider>
      <PaletteProvider>
        <AssetsFilterProvider>
          <SpotlightProvider>
            <CreateModalProvider>
              <NewProjectModalProvider>
              <ToolProvider>
                <AssistantPanelProvider>
                <div
                  className="flex h-screen w-full flex-col overflow-hidden p-2 text-[var(--surface-foreground-0)]"
                  style={{ background: "var(--surface-0)" }}
                >
                  <ContentWrapper>{children}</ContentWrapper>
                </div>
                </AssistantPanelProvider>
              </ToolProvider>
              </NewProjectModalProvider>
            </CreateModalProvider>
          </SpotlightProvider>
        </AssetsFilterProvider>
      </PaletteProvider>
    </FolderProvider>
  );
}
