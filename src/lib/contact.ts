import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  organization: z.string().min(2, "Please enter your organization."),
  role: z.enum(["Student", "College", "Company"]),
  message: z.string().min(10, "Please add a short message (10+ characters)."),
  website_url: z.string().optional(), // Honeypot
});


export type ContactInput = z.infer<typeof contactSchema>;

