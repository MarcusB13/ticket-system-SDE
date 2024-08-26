interface User {
  uuid: string;
  username: string;
  email: string;
  role: Roles;
  is_active: boolean;
  company: Company[];
}
