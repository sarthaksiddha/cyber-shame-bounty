
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Flag, Send, Users, AlertTriangle, DollarSign, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  scammerName: z.string().min(5, {
    message: "Scammer name must be at least 5 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  victims: z.string().regex(/^\d+$/, {
    message: "Please enter a valid number",
  }),
  amount: z.string().min(1, {
    message: "Please enter the estimated amount scammed",
  }),
  type: z.string().min(1, {
    message: "Please select a scam type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ScamReportForm = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scammerName: "",
      description: "",
      victims: "",
      amount: "",
      type: "",
    },
  });

  function onSubmit(data: FormValues) {
    toast({
      title: "Scam Report Submitted",
      description: "Thank you for helping protect others from scams!",
    });
    
    console.log("Scam report submitted:", data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="scammerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Scammer Name/Identity
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'Tech Support Pro' or individual name" {...field} />
                </FormControl>
                <FormDescription>
                  The name or entity behind the scam
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Type of Scam
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scam type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tech Support Scam">Tech Support Scam</SelectItem>
                    <SelectItem value="Banking Fraud">Banking Fraud</SelectItem>
                    <SelectItem value="Social Engineering">Social Engineering</SelectItem>
                    <SelectItem value="Investment Fraud">Investment Fraud</SelectItem>
                    <SelectItem value="Email Scam">Email Scam</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Category of the scam technique used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe how the scam works, what techniques they use, etc." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide detailed information about how the scam operates
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="victims"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Estimated Victims
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g. 100" {...field} />
                </FormControl>
                <FormDescription>
                  Approximate number of people affected
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Estimated Amount
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ₹50,000" {...field} />
                </FormControl>
                <FormDescription>
                  Approximate financial damage (in ₹)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          <Send className="mr-2 h-4 w-4" /> Submit Report
        </Button>
      </form>
    </Form>
  );
};

export default ScamReportForm;
