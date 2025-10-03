import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Nft {
  @Prop({ required: [true, 'Token address is required'], trim: true })
  sTokenAddress: string;

  @Prop({ required: [true, 'Token ID is required'], trim: true })
  nTokenId: number;

  @Prop({ required: [true, 'NFT Name is required'], trim: true })
  sNftName: string;

  @Prop({ required: [true, 'NFT Price is required'], trim: true })
  nNftPrice: string;

  @Prop({ required: [true, 'Royalty is required'], trim: true })
  nRoyalty: number;

  @Prop({ required: [true, 'First minter address is required'], trim: true })
  sFirstMInterAddress: string;

  @Prop({ required: [true, 'Nft description is required'], trim: true })
  sDescription: string;

  @Prop({ required: [true, 'Nft image URL is required'], trim: true })
  sImageUrl: string;

  @Prop({ required: [true, 'Nft token URI is required'], trim: true })
  sTokenUri: string;

  @Prop({ required: [true, 'Nft current owner is required'], trim: true })
  sCurrentOwner: string;

  @Prop({ default: false })
  isApprovedForSale: boolean;

  @Prop({ default: false })
  isApprovedForAuction: boolean;

  @Prop({
    type: {
      nBasePrice: { type: String, default: '0', trim: true },
      dStartTime: { type: String, default: null },
      dEndTime: { type: String, default: null },
      nHighestBid: { type: String, default: '0', trim: true },
      sHighestBidder: { type: String, default: '', trim: true },
      sSettlementTime: { type: String, default: null },
      bAuctionEnded: { type: Boolean, default: false },
    },
    default: {},
  })
  oAuctionDetails: {
    nBasePrice: string;
    dStartTime: string | null;
    dEndTime: string | null;
    nHighestBid: string;
    sHighestBidder: string;
    sSettlementTime: string | null;
    bAuctionEnded: boolean;
  };
}

export const NftSchema = SchemaFactory.createForClass(Nft);
