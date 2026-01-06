import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Keyboard, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

export function InfoDialog() {
  const { t } = useLocale();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-sm bg-card hover:bg-accent">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.info.title}</DialogTitle>
          <DialogDescription>
            {t.info.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Keyboard className="w-4 h-4" /> {t.info.shortcuts}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
              <li className="flex justify-between items-center bg-muted/50 p-2 rounded">
                <span>{t.info.shortcutItems.addChild}</span>
                <kbd className="bg-background px-1 rounded border">Tab</kbd>
              </li>
              <li className="flex justify-between items-center bg-muted/50 p-2 rounded">
                <span>{t.info.shortcutItems.addSibling}</span>
                <kbd className="bg-background px-1 rounded border">Enter</kbd>
              </li>
              <li className="flex justify-between items-center bg-muted/50 p-2 rounded">
                <span>{t.info.shortcutItems.delete}</span>
                <kbd className="bg-background px-1 rounded border">Del/Bksp</kbd>
              </li>
              <li className="flex justify-between items-center bg-muted/50 p-2 rounded">
                <span>{t.info.shortcutItems.editText}</span>
                <kbd className="bg-background px-1 rounded border">Dbl Click</kbd>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" /> {t.info.interactions}
            </h4>
            <div className="text-muted-foreground space-y-1">
              <p>• <strong>{t.info.interactionItems.reparent}</strong></p>
              <p>• <strong>{t.info.interactionItems.edgeStyle}</strong></p>
              <p>• <strong>{t.info.interactionItems.multiSelect}</strong></p>
              <p>• <strong>{t.info.interactionItems.skins}</strong></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
