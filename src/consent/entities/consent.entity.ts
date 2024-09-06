import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/base.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class Consent extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.consent)
  public user?: User;

  @Column({ default: false })
  public overFourteen: boolean;

  @Column({ default: false })
  public agreeOfTerm: boolean;

  @Column({ default: false })
  public agreeOfPersonalInfo: boolean;

  @Column({ default: false })
  public agreeOfMarketing: boolean;

  @Column({ default: false })
  public agreeOfETC: boolean;
}
