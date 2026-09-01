import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { GetCurrentUserUseCase } from '../../../auth/application/use-cases/get-current-user.use-case.js';
import { UserRole } from '../../../auth/domain/entities/user.entity.js';
import { Roles } from '../../../auth/infrastructure/http/decorators/roles.decorator.js';
import type { AuthenticatedRequest } from '../../../auth/infrastructure/http/guards/jwt-auth.guard.js';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/http/guards/roles.guard.js';
import { ExportInspectionPdfUseCase } from '../../application/use-cases/export-inspection-pdf.use-case.js';
import { GetInspectionUseCase } from '../../application/use-cases/get-inspection.use-case.js';
import { ListInspectionsUseCase } from '../../application/use-cases/list-inspections.use-case.js';
import { RegisterInspectionUseCase } from '../../application/use-cases/register-inspection.use-case.js';
import { InspectionResponseDto } from './dto/inspection-response.dto.js';
import { ListInspectionsQueryDto } from './dto/list-inspections-query.dto.js';
import { RegisterInspectionRequestDto } from './dto/register-inspection-request.dto.js';

@ApiTags('inspections')
@ApiBearerAuth()
@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionController {
  constructor(
    private readonly registerInspectionUseCase: RegisterInspectionUseCase,
    private readonly listInspectionsUseCase: ListInspectionsUseCase,
    private readonly getInspectionUseCase: GetInspectionUseCase,
    private readonly exportInspectionPdfUseCase: ExportInspectionPdfUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post()
  @Roles(UserRole.INSPECTOR)
  @ApiOkResponse({ type: InspectionResponseDto })
  async register(
    @Req() request: AuthenticatedRequest,
    @Body() dto: RegisterInspectionRequestDto,
  ): Promise<InspectionResponseDto> {
    const inspector = await this.getCurrentUserUseCase.execute(request.user!.sub);

    return this.registerInspectionUseCase.execute({
      vehiclePlate: dto.vehiclePlate,
      unNumber: dto.unNumber,
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
      ringelmannGrade: dto.ringelmannGrade,
      comments: dto.comments,
      evidences: dto.evidences,
    });
  }

  @Get()
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: [InspectionResponseDto] })
  list(@Query() query: ListInspectionsQueryDto): Promise<InspectionResponseDto[]> {
    return this.listInspectionsUseCase.execute({
      vehiclePlate: query.vehiclePlate,
      unNumber: query.unNumber,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }

  @Get(':id')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: InspectionResponseDto })
  get(@Param('id') id: string): Promise<InspectionResponseDto> {
    return this.getInspectionUseCase.execute(id);
  }

  @Get(':id/pdf')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const pdf = await this.exportInspectionPdfUseCase.execute(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inspection-${id}.pdf"`,
    });
    res.send(pdf);
  }
}
