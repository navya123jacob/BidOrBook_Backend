import { Request, Response } from "express";
interface IAdminController {
    login(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    blockUser(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    updateAdmin(req: Request, res: Response): Promise<void>;
    getAdminDetails(req: Request, res: Response): Promise<void>;
    getEvents(req: Request, res: Response): Promise<void>;
    deleteEvent(req: Request, res: Response): Promise<void>;
    createEvent(req: Request, res: Response): Promise<void>


}
export default IAdminController