export interface ApplyCareerAction {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneValue: string;
  resume: File;
  coverLetter: File;
}
