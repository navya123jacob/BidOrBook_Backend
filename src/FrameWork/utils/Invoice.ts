import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Response } from 'express'; 
import { IAuction } from '../../Domain/Auction';

class PdfService {
  async generateAndDownloadInvoice(auction: IAuction, res: Response) {
    console.log(auction)
    const bidder = auction.bids[auction.bids.length - 1];
    const userId = bidder?.userId||'';
    let amount=bidder?.amount||0
    const doc = new PDFDocument();

    const filename = `${auction._id}_invoice.pdf`;

    const filePath = path.resolve(__dirname, '..', 'temp', filename);
   
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(`Invoice for Auction: ${auction.name}`);
    doc.text(`Auction Description: ${auction.description}`);
    doc.text(`Purchased By: ${userId}`);
    doc.text(`Purchase Amount: ${amount}`);
    doc.text(`Payment Method: Wallet`);
    doc.text(`Address: ${auction.address}`);

    doc.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    fs.createReadStream(filePath).pipe(res);

    setTimeout(() => fs.unlinkSync(filePath), 1000);
  }
}

export default new PdfService();