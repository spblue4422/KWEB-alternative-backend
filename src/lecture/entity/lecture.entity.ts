import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Lecture {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'uid' })
	user: User;

	@Column({ unique: true })
	name: string;

	@Column()
	description: string;

	@CreateDateColumn()
	createdDate: Date;
}
