import IGenerateOTP from "../../use_case/interface/services/IgenerateOtp";

class GenerateOTP implements IGenerateOTP {
  async generateOtp(length: number): Promise<string> {
    const numericCharacters = "0123456789";
    const codeArray: string[] = [];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * numericCharacters.length);
      codeArray.push(numericCharacters.charAt(randomIndex));
    }

    return codeArray.join("");
  }
}

export default GenerateOTP;
