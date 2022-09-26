import {
	PrimaryGeneratedColumn,
	JoinColumn,
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/entity/course.entity';

@Entity('application')
export class Application {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user' })
	user: User;

	@ManyToOne((type) => Course, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'course' })
	course: Course;

	@CreateDateColumn()
	createdDate: Date;
}
