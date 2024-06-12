import cron from 'node-cron';
import AuctionUseCase from '../../use_case/auctionUseCase';
import AuctionRepository from '../repository/AuctionRepository';

const auctionRepo = new AuctionRepository();
const auctionUseCase = new AuctionUseCase(auctionRepo);

cron.schedule('* * * * *', async () => {
  try {
    await auctionUseCase.updateAuctionStatus();
   
  } catch (error) {
    console.error('Error updating auction statuses:', error);
  }
});
