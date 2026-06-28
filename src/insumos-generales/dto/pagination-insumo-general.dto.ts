import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from '~/common/pagination/dto/pagination.dto';

export class PaginationInsumoGeneralDto extends PartialType(PaginationDto) {}
