import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesDecorator } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { BanDto } from './dto/ban.dto';
import { BanService } from './ban.service';
import { AccessLevel } from 'src/roles/common/role.common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("User management")
@Controller()
export class BanController {
    constructor(private banService: BanService) { }

    @HttpCode(HttpStatus.OK)
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @RolesDecorator(AccessLevel.MODERATOR)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('ban')
    async ban(@Body() banDto: BanDto): Promise<void> {
        await this.banService.ban(banDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiOkResponse()
    @RolesDecorator(AccessLevel.MODERATOR)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('unban/:id')
    async unbanUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.banService.unbanUser(id);
    }
}
