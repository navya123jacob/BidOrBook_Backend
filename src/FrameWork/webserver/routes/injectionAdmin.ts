import Encrypt from "../../passwordRepository/hashpassword";
import JWTToken from "../../passwordRepository/jwtpassword";
import AdminRepository from "../../repository/AdminRepository";
import AdminUseCase from "../../../use_case/AdminUseCase";
import AdminController from "../../../adapter/AdminController";

// Dependency Injection
const encrypt = new Encrypt();
const jwtToken = new JWTToken();
const adminRepo = new AdminRepository(encrypt);
const adminUseCase = new AdminUseCase(adminRepo, encrypt, jwtToken);
const adminController = new AdminController(adminUseCase);

export { adminController };
