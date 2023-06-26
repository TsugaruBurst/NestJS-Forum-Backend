import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { convertStringToRoleTitle } from 'src/roles/common/roles.common';
import { RolesDecorator } from 'src/roles/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { ComplaintBanDto } from './dto/complaint-ban.dto';
import { ComplaintBanService } from './complaint-ban.service';

@Controller('complaint-ban')
export class ComplaintBanController {
    constructor(private complaintBanService: ComplaintBanService) { }

    @RolesDecorator(convertStringToRoleTitle('admin'))
    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    ban(@Body() complaintBanDto: ComplaintBanDto) {
        return this.complaintBanService.ban(complaintBanDto);
    }
}