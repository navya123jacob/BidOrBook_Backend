import { Request, Response } from "express";
interface IAdminController {
    login(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    blockUser(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    updateAdmin(req: Request, res: Response): Promise<void>

}
export default IAdminController