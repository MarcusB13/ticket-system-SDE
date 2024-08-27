interface User {
  uuid: string;
  username: string;
  email: string;
  role: Roles;
  is_active: boolean;
  company: Company[];
  created_at: string;
  pk: number;
}
