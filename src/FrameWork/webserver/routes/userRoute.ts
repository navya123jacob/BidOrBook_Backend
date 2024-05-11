import userController from "../../../adapter/userController";
import Userusecase from "../../../use_case/userUsecases";
import Encrypt from "../../passwordRepository/hashpassword";
import express  from "express";

import userRepository from "../../repository/userRepository";
import jwtPassword from "../../passwordRepository/jwtpassword";
import nodemailerUtils from "../../utils/sendMail";
import GenerateOTP from "../../utils/generateOtp";

const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();

const generateOtp= new GenerateOTP()

const repository = new userRepository(encrypt); // Pass encrypt to the userRepository constructor


const useCase=new Userusecase(encrypt,repository,JWTPassword)

const controller = new userController(useCase, sendMail, generateOtp)


const router=express.Router();

//user
router.post("/singup", (req, res) => controller.signup(req, res));
router.post("/login", (req, res) => controller.login(req, res));



export default router