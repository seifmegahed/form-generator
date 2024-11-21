import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function DrawerDialog({
  children,
  button,
  open,
  setOpen,
  title = "dialog",
  description = "dialog description",
}: {
  children: React.ReactNode;
  button: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="w-full max-w-[80vw] max-h-[90vh] overflow-y-scroll">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
