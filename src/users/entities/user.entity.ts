import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  sName: string;

  @Prop({ unique: true })
  sEmail: string;

  @Prop()
  sPassword: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  sRole: string;

  @Prop({
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  sProfileImage: string;

  @Prop({ default: false })
  isLoggedIn: boolean;

  @Prop({ default: Date.now })
  dCreatedAt: Date;

  @Prop({ default: Date.now })
  dUpdatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
