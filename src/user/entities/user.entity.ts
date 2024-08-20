import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { Provider } from '../../common/enums/provider.enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  @Column()
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @BeforeInsert()
  async beforeSaveFunction() {
    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);

        this.profileImg = gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
