
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  scammerName: z.string().min(2, 'Name must be at least 2 characters'),
  scammerPhone: z.string().optional(),
  scammerEmail: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid URL').optional(),
  scamType: z.string().min(1, 'Please select a scam type'),
  description: z.string().min(10, 'Please provide more details'),
  evidenceLink: z.string().url('Invalid URL').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ScamReportFormProps {
  onSuccess?: () => void;
}

const ScamReportForm = ({ onSuccess }: ScamReportFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scammerName: '',
      scammerPhone: '',
      scammerEmail: '',
      website: '',
      scamType: '',
      description: '',
      evidenceLink: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    
    // Here you would typically send the data to your backend
    
    toast({
      title: "Report submitted!",
      description: "Thank you for helping make India's digital space safer.",
    });

    form.reset();
    
    // Call onSuccess if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="scammerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scammer Name/Organization <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter name or organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scammerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="+91 XXXXX XXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="scammerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (if applicable)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scamType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scam Type <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of scam" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="impersonation">Impersonation</SelectItem>
                  <SelectItem value="fake_investment">Fake Investment</SelectItem>
                  <SelectItem value="job_scam">Job Scam</SelectItem>
                  <SelectItem value="tech_support">Tech Support Scam</SelectItem>
                  <SelectItem value="lottery">Lottery/Prize Scam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe the scam in detail..." 
                  rows={5}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evidenceLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evidence Link (screenshots, recordings, etc.)</FormLabel>
              <FormControl>
                <Input placeholder="https://drive.google.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">Submit Report</Button>
        </div>
      </form>
    </Form>
  );
};

export default ScamReportForm;
