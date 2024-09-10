export interface IMailService {
  sendMail(params: mailParams): Promise<void>;
}

export interface mailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}