interface Ticket {
  uuid: string;
  subject: string;
  assigned: User;
  created_by: User;
  priority?: Priority;
  status: Status;
  level: number;
  due_date: string | null;
  description: string;
  service_level_agreement: ServiceLevelAgreement;
  created_at: string;
  pk: number;
  solution?: string;
}
