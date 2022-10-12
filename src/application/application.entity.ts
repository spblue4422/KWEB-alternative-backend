import {
	PrimaryGeneratedColumn,
	JoinColumn,
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/entity/course.entity';

@Entity('application')
export class Application {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: 'id' })
	id: number;

	@ManyToOne((type) => User, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user' })
	@ApiProperty({ description: 'user' })
	user: User;

	@ManyToOne((type) => Course, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'course' })
	@ApiProperty({ description: 'course' })
	course: Course;

	@CreateDateColumn()
	@ApiProperty({ description: '등록 일자' })
	createdDate: Date;
}
