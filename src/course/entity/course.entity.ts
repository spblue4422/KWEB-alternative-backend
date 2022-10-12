import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: 'id' })
	id: number;

	@ManyToOne((type) => User, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user' })
	@ApiProperty({ description: 'user' })
	user: User;

	@Column({ unique: true })
	@ApiProperty({ description: '코스명' })
	name: string;

	@Column()
	@ApiProperty({ description: '설명' })
	description: string;

	@CreateDateColumn()
	@ApiProperty({ description: '등록 일자' })
	createdDate: Date;
}
