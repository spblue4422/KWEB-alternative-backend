import {
	Column,
	PrimaryGeneratedColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity()
export class LectureBoard {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => Lecture, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'lid' })
	lecture: Lecture;

	@Column()
	title: string;

	@Column()
	content: string;

	@CreateDateColumn()
	createdDate: Date;
}
