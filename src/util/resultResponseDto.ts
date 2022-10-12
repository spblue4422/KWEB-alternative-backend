import { ApiProperty } from '@nestjs/swagger';

export class ResultResponseDto {
	@ApiProperty({ description: '상태 코드' })
	code: string;

	@ApiProperty({ description: '메시지' })
	msg: string;

	@ApiProperty({ description: '데이터' })
	data: any;
}
