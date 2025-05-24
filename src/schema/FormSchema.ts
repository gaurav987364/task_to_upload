import { z } from 'zod';

// Blood group validation
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// Phone number regex (supports various international formats)
const phoneRegex = /^[+]?([1-9][\d]{0,15})$/;

// Email validation using Zod's built-in email validation
const emailSchema = z.string().email('Please enter a valid email address');

// Date validation helper
const dateSchema = z.string().refine((date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
}, {
  message: 'Please enter a valid date in the past'
});

// Age validation that corresponds with date of birth
const ageSchema = z.number()
  .int('Age must be a whole number')
  .min(0, 'Age cannot be negative')
  .max(150, 'Age must be realistic');

// Height validation (supports both cm and feet/inches format)
const heightSchema = z.string()
  .min(1, 'Height is required')
  .refine((height) => {
    // Check for cm format (e.g., "175cm", "175 cm", "175")
    const cmMatch = height.match(/^(\d+(?:\.\d+)?)\s*c?m?$/i);
    if (cmMatch) {
      const cm = parseFloat(cmMatch[1]);
      return cm >= 30 && cm <= 300; // Reasonable height range in cm
    }
    
    // Check for feet/inches format (e.g., "5'10", "5 ft 10 in", "5'10\"")
    const feetInchesMatch = height.match(/^(\d+)(?:\s*(?:ft|feet|')\s*)?(\d+)?(?:\s*(?:in|inches|")\s*)?$/i);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1]);
      const inches = parseInt(feetInchesMatch[2] || '0');
      const totalInches = feet * 12 + inches;
      return totalInches >= 12 && totalInches <= 120; // Reasonable height range in inches
    }
    
    return false;
  }, {
    message: 'Please enter height in valid format (e.g., "175cm", "5\'10"", "5 ft 10 in")'
  });

// Weight validation (supports kg and lbs)
const weightSchema = z.string()
  .min(1, 'Weight is required')
  .refine((weight) => {
    // Check for kg format (e.g., "70kg", "70 kg", "70")
    const kgMatch = weight.match(/^(\d+(?:\.\d+)?)\s*k?g?$/i);
    if (kgMatch) {
      const kg = parseFloat(kgMatch[1]);
      return kg >= 1 && kg <= 1000; // Reasonable weight range in kg
    }
    
    // Check for lbs format (e.g., "154lbs", "154 lbs", "154 lb")
    const lbsMatch = weight.match(/^(\d+(?:\.\d+)?)\s*l?b?s?$/i);
    if (lbsMatch) {
      const lbs = parseFloat(lbsMatch[1]);
      return lbs >= 2 && lbs <= 2200; // Reasonable weight range in lbs
    }
    
    return false;
  }, {
    message: 'Please enter weight in valid format (e.g., "70kg", "154lbs")'
  });

// Pincode validation (flexible for different countries)
const pincodeSchema = z.string()
  .min(3, 'Pincode must be at least 3 characters')
  .max(10, 'Pincode must be at most 10 characters')
  .regex(/^[A-Za-z0-9\s-]+$/, 'Pincode can only contain letters, numbers, spaces, and hyphens');

// User Info Form Schema
export const UserInfoFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'First name can only contain letters, spaces, apostrophes, and hyphens'),
  
  middleName: z.string()
    .max(50, 'Middle name must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]*$/, 'Middle name can only contain letters, spaces, apostrophes, and hyphens')
    .optional(),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'Last name can only contain letters, spaces, apostrophes, and hyphens'),
  
  mobileNo: z.string()
    .min(1, 'Mobile number is required')
    .regex(phoneRegex, 'Please enter a valid mobile number'),
  
  email: emailSchema,
  
  dob: dateSchema,
  
  age: ageSchema,
  
  bloodGroup: z.enum(bloodGroups, {
    errorMap: () => ({ message: 'Please select a valid blood group' })
  }),
  
  height: heightSchema,
  
  weight: weightSchema,
  
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
    errorMap: () => ({ message: 'Please select a valid marital status' })
  })
}).refine((data) => {
  // Cross-validation: Check if age matches approximately with date of birth
  const dobDate = new Date(data.dob);
  const today = new Date();
  const calculatedAge = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  
  // Adjust age if birthday hasn't occurred this year
  const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) 
    ? calculatedAge - 1 
    : calculatedAge;
  
  // Allow for a 1-year difference to account for timing
  return Math.abs(data.age - adjustedAge) <= 1;
}, {
  message: 'Age does not match with date of birth',
  path: ['age']
});

// Address Form Schema
export const AddressFormSchema = z.object({
  addressLine1: z.string()
    .min(1, 'Address line 1 is required')
    .min(5, 'Address line 1 must be at least 5 characters')
    .max(100, 'Address line 1 must be at most 100 characters'),
  
  addressLine2: z.string()
    .max(100, 'Address line 2 must be at most 100 characters')
    .optional(),
  
  city: z.string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'City can only contain letters, spaces, apostrophes, and hyphens'),
  
  state: z.string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'State can only contain letters, spaces, apostrophes, and hyphens'),
  
  country: z.string()
    .min(1, 'Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be at most 50 characters')
    .regex(/^[A-Za-z\s'-]+$/, 'Country can only contain letters, spaces, apostrophes, and hyphens'),
  
  pincode: pincodeSchema
});

// Combined schema if you need both forms together
export const CombinedUserFormSchema = z.object({
  userInfo: UserInfoFormSchema,
  address: AddressFormSchema
});

// Type exports for TypeScript
export type UserInfoFormData = z.infer<typeof UserInfoFormSchema>;
export type AddressFormData = z.infer<typeof AddressFormSchema>;
export type CombinedUserFormData = z.infer<typeof CombinedUserFormSchema>;

// Validation helper functions
export const validateUserInfo = (data: unknown) => {
  return UserInfoFormSchema.safeParse(data);
};

export const validateAddress = (data: unknown) => {
  return AddressFormSchema.safeParse(data);
};

export const validateCombinedForm = (data: unknown) => {
  return CombinedUserFormSchema.safeParse(data);
};