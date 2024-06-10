import cron from 'node-cron';
import AuctionUseCase from '../../use_case/auctionUseCase';
import AuctionRepository from '../repository/AuctionRepository';

const auctionRepo = new AuctionRepository();
const auctionUseCase = new AuctionUseCase(auctionRepo);

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  try {
    await auctionUseCase.updateAuctionStatus();
    console.log('Auction statuses updated based on ending date');
  } catch (error) {
    console.error('Error updating auction statuses:', error);
  }
});
