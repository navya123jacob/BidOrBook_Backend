import bcrypt from 'bcrypt';
import Hashpassword from '../../use_case/interface/services/Ihashpassword';

class Encrypt implements Hashpassword{
    async generateHash(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            console.log('Generated salt:', salt,password);
    
            const hashpassword = await bcrypt.hash(password, salt);
            console.log('Generated hash:', hashpassword);
    
            return hashpassword;
        } catch (error) {
            console.error('Error generating hash:', error);
            throw error; // Propagate the error
        }
    }
    

   async compare(password: string, hashpassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashpassword);
    return match
    }
}

export default Encrypt