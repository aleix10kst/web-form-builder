import { FormElements } from "./form-elements"
import { FormElementsSidebar } from "./form-elements-sidebar"
import { useDesigner } from "./hooks/use-designer"
import { PropertiesFormSidebar } from "./properties-form-sidebar"
import { SidebarButtonElement } from "./sidebar-button-element"

interface DesignerSidebarProps {
  children: React.ReactNode
}

export function DesignerSidebar() {
  const { selectedElement } = useDesigner()
  return (
    <aside className="flex h-full w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4">
      {selectedElement ? <PropertiesFormSidebar /> : <FormElementsSidebar />}
    </aside>
  )
}
