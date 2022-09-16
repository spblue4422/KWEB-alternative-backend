import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	userId: string;

	@Column()
	password: string;

	@Column()
	name: string;

	@Column({ unique: true })
	uniqueNum: string;

	@Column()
	status: string;

	@CreateDateColumn()
	createdDate: Date;
}
