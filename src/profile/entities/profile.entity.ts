import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/base.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@common/enums/gender.enum';
import { BloodType } from '@common/enums/bloodtype.enum';

@Entity()
export class Profile extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.profile)
  public user?: User;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MINORITY,
  })
  public gender: Gender;

  @Column()
  public age: number;

  @Column()
  public birthday: Date;

  @Column()
  public height: number;

  @Column()
  public addressOfHome: string;

  @Column({
    type: 'enum',
    enum: BloodType,
    default: BloodType.TYPE_A,
  })
  public bloodType: BloodType;

  @Column()
  public introduction: string;
}
