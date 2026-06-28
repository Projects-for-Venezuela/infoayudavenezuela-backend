import { Prisma } from 'generated/prisma/client';
import { HospitalResponseDto } from '../dto/hospital-response.dto';

type HospitalEntity = Prisma.hospitalesGetPayload<{
  include: {
    ciudades: true;
  };
}>;

export class HospitalMapper {
  static toResponse(hospital: HospitalEntity): HospitalResponseDto {
    return {
      id: hospital.id,
      nombre: hospital.nombre,
      ciudad: hospital.ciudades.nombre,
    };
  }

  static toResponseList(hospitales: HospitalEntity[]): HospitalResponseDto[] {
    return hospitales.map((hospital) => this.toResponse(hospital));
  }
}
