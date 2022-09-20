import {
	Column,
	PrimaryGeneratedColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Lecture {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => Course, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'lecture' })
	course: Course;

	@Column()
	title: string;

	@Column()
	content: string;

	@CreateDateColumn()
	createdDate: Date;
}
