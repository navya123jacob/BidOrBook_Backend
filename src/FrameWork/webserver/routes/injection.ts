// dependencyInjection.ts

import Encrypt from "../../passwordRepository/hashpassword";
import UserRepository from "../../repository/userRepository";
import JWTPassword from "../../passwordRepository/jwtpassword";
import NodemailerUtils from "../../utils/sendMail";
import GenerateOTP from "../../utils/generateOtp";
import BookingRepository from "../../repository/BookingRepository";
import { BookingUseCase } from "../../../use_case/BookingUseCase";
import MessageRepository from "../../repository/ConvRepository";
import MessageUseCase from "../../../use_case/ConvUseCase";
import UserUseCase from "../../../use_case/userUsecases";
import IUserRepository from "../../../use_case/interface/RepositoryInterface/IuserRepo";
import IBookingRepository from "../../../use_case/interface/RepositoryInterface/IbookingRepo";
import IMessageRepository from "../../../use_case/interface/RepositoryInterface/IconvRepo";
import IPostRepository from "../../../use_case/interface/RepositoryInterface/IpostRepo";
import IEncrypt from "../../../use_case/interface/services/Ihashpassword";
import IJWTPassword from "../../../use_case/interface/services/Ijwt";
import INodemailerUtils from "../../../use_case/interface/services/ISendMail";
import IGenerateOTP from "../../../use_case/interface/services/IgenerateOtp";
import IUserController from "../../../use_case/interface/ControllerInterface/IuserController";
import IBookingController from "../../../use_case/interface/ControllerInterface/IbookingController";
import IMessageController from "../../../use_case/interface/ControllerInterface/IConvController";
import IPostController from "../../../use_case/interface/ControllerInterface/IpostController";
import UserController from "../../../adapter/userController";
import { BookingController } from "../../../adapter/bookingController";
import MessageController from "../../../adapter/ConvController";
import PostController from "../../../adapter/postController";
import PostRepository from "../../repository/postRepository";
import PostUseCase from "../../../use_case/postUseCase";
import Stripe from 'stripe';
import { io } from "../../..";
import IAuctionRepository from "../../../use_case/interface/RepositoryInterface/IAuctionRepo";
import IAuctionUseCase from "../../../use_case/interface/useCaseInterface/IAuctionUseCase";
import IAuctionController from "../../../use_case/interface/ControllerInterface/IauctionController";
import AuctionRepository from "../../repository/AuctionRepository";
import AuctionUseCase from "../../../use_case/auctionUseCase";
import AuctionController from "../../../adapter/auctionController";

// Initialize utilities
const encrypt: IEncrypt = new Encrypt();
const jwtPassword: IJWTPassword = new JWTPassword();
const nodemailerUtils: INodemailerUtils = new NodemailerUtils();
const generateOTP: IGenerateOTP = new GenerateOTP();

// Initialize repositories
const userRepository: IUserRepository = new UserRepository(encrypt);
const bookingRepository: IBookingRepository = new BookingRepository();
const messageRepository: IMessageRepository = new MessageRepository();
const postRepository: IPostRepository = new PostRepository();
const auctionRepository: IAuctionRepository = new AuctionRepository();

// Initialize use cases
const userUseCase: UserUseCase = new UserUseCase(encrypt, userRepository, jwtPassword);
const bookingUseCase: BookingUseCase = new BookingUseCase(bookingRepository);
const messageUseCase: MessageUseCase = new MessageUseCase(messageRepository);
const postUseCase: PostUseCase = new PostUseCase(postRepository);
const auctionUseCase: IAuctionUseCase = new AuctionUseCase(auctionRepository);

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

// Initialize controllers
const userController: IUserController = new UserController(userUseCase, nodemailerUtils, generateOTP);
const bookingController: IBookingController = new BookingController(bookingUseCase, userUseCase, stripe,auctionUseCase);
const messageController: IMessageController = new MessageController(messageUseCase);
const postController: IPostController = new PostController(userUseCase, postUseCase);
const auctionController: IAuctionController = new AuctionController(auctionUseCase, stripe,userUseCase);

// Export dependencies
export {
    userController,
    bookingController,
    messageController,
    postController,
    auctionController
};
