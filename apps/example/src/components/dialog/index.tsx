import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function DrawerDialog({
  children,
  button,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  button: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="w-full max-w-screen-lg">
        {children}
      </DialogContent>
    </Dialog>
  );
}
