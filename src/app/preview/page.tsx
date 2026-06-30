"use client";

/**
 * Throwaway UI-primitive showcase (S1 verification only).
 * Lets us eyeball default/hover/disabled states + Drawer/Modal/Toast motion.
 * Safe to delete once the real shell exists.
 */
import { useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  Button,
  IconButton,
  Pill,
  Spinner,
  Input,
  Select,
  Checkbox,
  Tooltip,
  Drawer,
  Modal,
  Menu,
  MenuItem,
  MenuSeparator,
  ToastProvider,
  useToast,
} from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-text-faint">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

function Showcase() {
  const { toast } = useToast();
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const [checked, setChecked] = useState(true);

  return (
    <main className="mx-auto max-w-3xl space-y-10 p-10">
      <header>
        <h1 className="text-lg font-semibold text-text">UI primitives</h1>
        <p className="text-sm text-text-muted">S1 verification preview.</p>
      </header>

      <Section title="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">
          <Plus size={14} /> Small
        </Button>
        <IconButton label="More">
          <MoreHorizontal size={16} />
        </IconButton>
      </Section>

      <Section title="Pills (status + credit)">
        <Pill tone="muted" dot>Idle</Pill>
        <Pill tone="accent" dot pulse>Running</Pill>
        <Pill tone="success" dot>Success</Pill>
        <Pill tone="error" dot>Error</Pill>
        <Pill tone="warning" dot>Skipped</Pill>
        <Pill tone="accent">1,000 credits</Pill>
      </Section>

      <Section title="Inputs">
        <Input placeholder="Text input" className="max-w-48" />
        <Input invalid placeholder="Invalid" className="max-w-48" />
        <Input disabled placeholder="Disabled" className="max-w-48" />
        <Select className="max-w-48" defaultValue="">
          <option value="" disabled>Pick one…</option>
          <option>Option A</option>
          <option>Option B</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-text">
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          Checkbox
        </label>
        <label className="flex items-center gap-2 text-sm text-text">
          <Checkbox indeterminate readOnly />
          Indeterminate
        </label>
        <Spinner />
      </Section>

      <Section title="Overlays">
        <Tooltip content="Tooltip content">
          <Button variant="secondary">Hover for tooltip</Button>
        </Tooltip>
        <Button variant="secondary" onClick={() => setDrawer(true)}>
          Open drawer
        </Button>
        <Button variant="secondary" onClick={() => setModal(true)}>
          Open modal
        </Button>
        <Menu
          trigger={
            <Button variant="secondary">
              <MoreHorizontal size={16} /> Menu
            </Button>
          }
        >
          <MenuItem icon={<Plus size={14} />}>Add item</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuSeparator />
          <MenuItem danger icon={<Trash2 size={14} />}>Delete</MenuItem>
        </Menu>
      </Section>

      <Section title="Toasts">
        <Button variant="secondary" onClick={() => toast({ title: "Saved" })}>
          Neutral
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ tone: "success", title: "Run complete", description: "240 cells enriched." })}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ tone: "error", title: "Run failed", description: "Provider timed out." })}
        >
          Error
        </Button>
      </Section>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Column config"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawer(false)}>Cancel</Button>
            <Button onClick={() => setDrawer(false)}>Save</Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          The right-side config drawer (slide-in). The real one is built in S10.
        </p>
        <Input className="mt-3" placeholder="Column name" />
      </Drawer>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="New table"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Create</Button>
          </>
        }
      >
        <p className="text-sm text-text-muted">Modal body content goes here.</p>
      </Modal>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <ToastProvider>
      <Showcase />
    </ToastProvider>
  );
}
