export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

export const formFields: FormField[] = [
  {
    
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter Your Name",
  },
  {
    
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter Your Password",
  },
];
