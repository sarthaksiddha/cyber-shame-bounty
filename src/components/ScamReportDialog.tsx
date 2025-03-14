
import React from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ScamReportForm from './ScamReportForm';

interface ScamReportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ScamReportDialog = ({ open, onOpenChange }: ScamReportDialogProps) => {
  // If not provided with controlled props, use the Dialog normally
  if (open === undefined || onOpenChange === undefined) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-primary font-medium hover:bg-primary/10 flex items-center gap-1 mx-auto">
            <Flag className="h-4 w-4" />
            <span>Submit a New Scam Report</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Flag className="h-5 w-5 text-red-500" />
              Report a Scam
            </DialogTitle>
            <DialogDescription>
              Help others stay safe by reporting scams you've encountered. Your report will be reviewed before being added to our database.
            </DialogDescription>
          </DialogHeader>
          <ScamReportForm />
        </DialogContent>
      </Dialog>
    );
  }

  // For controlled usage from other components
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Flag className="h-5 w-5 text-red-500" />
            Report a Scam
          </DialogTitle>
          <DialogDescription>
            Help others stay safe by reporting scams you've encountered. Your report will be reviewed before being added to our database.
          </DialogDescription>
        </DialogHeader>
        <ScamReportForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ScamReportDialog;
