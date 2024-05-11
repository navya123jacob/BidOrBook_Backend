import { User } from "../../Domain/userEntity";

interface IUserRepo {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}

export default IUserRepo;
