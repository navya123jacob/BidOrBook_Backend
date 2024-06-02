interface IGenerateOTP {
    generateOtp(length: number): Promise<string>;
  }
  
  export default IGenerateOTP;
  