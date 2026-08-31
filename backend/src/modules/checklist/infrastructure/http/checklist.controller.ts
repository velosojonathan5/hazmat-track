import { Controller, Get, Param, Post, Body, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { GetCurrentUserUseCase } from '../../../auth/application/use-cases/get-current-user.use-case.js';
import { UserRole } from '../../../auth/domain/entities/user.entity.js';
import { Roles } from '../../../auth/infrastructure/http/decorators/roles.decorator.js';
import type { AuthenticatedRequest } from '../../../auth/infrastructure/http/guards/jwt-auth.guard.js';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/http/guards/roles.guard.js';
import { ExportChecklistPdfUseCase } from '../../application/use-cases/export-checklist-pdf.use-case.js';
import { GetChecklistUseCase } from '../../application/use-cases/get-checklist.use-case.js';
import { ListChecklistItemsUseCase } from '../../application/use-cases/list-checklist-items.use-case.js';
import { ListChecklistsUseCase } from '../../application/use-cases/list-checklists.use-case.js';
import { ListNonConformitiesUseCase } from '../../application/use-cases/list-non-conformities.use-case.js';
import { SubmitChecklistUseCase } from '../../application/use-cases/submit-checklist.use-case.js';
import { ChecklistItemResponseDto } from './dto/checklist-item-response.dto.js';
import { ChecklistResponseDto } from './dto/checklist-response.dto.js';
import { ListChecklistsQueryDto } from './dto/list-checklists-query.dto.js';
import { ListNonConformitiesQueryDto } from './dto/list-non-conformities-query.dto.js';
import { NonConformityResponseDto } from './dto/non-conformity-response.dto.js';
import { SubmitChecklistRequestDto } from './dto/submit-checklist-request.dto.js';

@ApiTags('checklists')
@ApiBearerAuth()
@Controller('checklists')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChecklistController {
  constructor(
    private readonly listChecklistItemsUseCase: ListChecklistItemsUseCase,
    private readonly submitChecklistUseCase: SubmitChecklistUseCase,
    private readonly listChecklistsUseCase: ListChecklistsUseCase,
    private readonly getChecklistUseCase: GetChecklistUseCase,
    private readonly exportChecklistPdfUseCase: ExportChecklistPdfUseCase,
    private readonly listNonConformitiesUseCase: ListNonConformitiesUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Get('items')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: [ChecklistItemResponseDto] })
  listItems(): Promise<ChecklistItemResponseDto[]> {
    return this.listChecklistItemsUseCase.execute();
  }

  @Get('non-conformities')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: [NonConformityResponseDto] })
  listNonConformities(@Query() query: ListNonConformitiesQueryDto): Promise<NonConformityResponseDto[]> {
    return this.listNonConformitiesUseCase.execute(query.status);
  }

  @Post()
  @Roles(UserRole.INSPECTOR)
  @ApiOkResponse({ type: ChecklistResponseDto })
  async submit(
    @Req() request: AuthenticatedRequest,
    @Body() dto: SubmitChecklistRequestDto,
  ): Promise<ChecklistResponseDto> {
    const inspector = await this.getCurrentUserUseCase.execute(request.user!.sub);

    return this.submitChecklistUseCase.execute({
      vehiclePlate: dto.vehiclePlate,
      driverName: dto.driverName,
      driverCnh: dto.driverCnh,
      unNumber: dto.unNumber,
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      answers: dto.answers,
    });
  }

  @Get()
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: [ChecklistResponseDto] })
  list(@Query() query: ListChecklistsQueryDto): Promise<ChecklistResponseDto[]> {
    return this.listChecklistsUseCase.execute({
      vehiclePlate: query.vehiclePlate,
      driverId: query.driverId,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }

  @Get(':id')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: ChecklistResponseDto })
  get(@Param('id') id: string): Promise<ChecklistResponseDto> {
    return this.getChecklistUseCase.execute(id);
  }

  @Get(':id/pdf')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const pdf = await this.exportChecklistPdfUseCase.execute(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="checklist-${id}.pdf"`,
    });
    res.send(pdf);
  }
}
