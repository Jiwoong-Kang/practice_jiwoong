import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  public profileImg?: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    try {
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);

      this.profileImg = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
