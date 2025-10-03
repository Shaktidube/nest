import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  sWalletAddress: string;

  @Prop({ unique: true })
  sEmail: string;

  @Prop()
  nOtp: number;

  @Prop({ default: null })
  nOtpExpiryTime: number;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  sToken: string;

  @Prop({
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  sUserProfileImage: string;

  @Prop({ default: false })
  sUsername: string;

  @Prop({ default: Date.now })
  dCreatedAt: Date;

  @Prop({ default: Date.now })
  dUpdatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
