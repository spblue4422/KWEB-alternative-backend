import {
	Column,
	PrimaryGeneratedColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from './course.entity';

@Entity()
export class Lecture {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: 'id' })
	id: number;

	@ManyToOne((type) => Course, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'course' })
	@ApiProperty({ description: 'course' })
	course: Course;

	@Column()
	@ApiProperty({ description: '제목' })
	title: string;

	@Column()
	@ApiProperty({ description: '내용' })
	content: string;

	@CreateDateColumn()
	@ApiProperty({ description: '등록 일자' })
	createdDate: Date;
}
