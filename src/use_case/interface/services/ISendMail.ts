interface IMailService {
  sendVerificationEmail(email: string, verificationToken: string): Promise<string> 
  }
  
  export default IMailService;
  