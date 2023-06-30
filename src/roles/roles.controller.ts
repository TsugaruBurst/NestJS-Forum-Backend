import { Body, Controller, Get, Param, UseGuards, ParseIntPipe, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RolesDecorator } from './decorators/roles.decorator';
import { SetRoleDto } from './dto/set-role.dto';
import { AccessLevel } from './common/role.common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './models/roles.model';

// New type of roles can only be added by own in database
@ApiTags("Roles")
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @HttpCode(HttpStatus.OK)
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: Role })
    @RolesDecorator(AccessLevel.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Get(":title")
    async getRoleByValue(@Param("title") roleTitle: string): Promise<Role> {
        return await this.rolesService.getRole(roleTitle);
    }

    @HttpCode(HttpStatus.OK)
    @ApiInternalServerErrorResponse()
    @ApiNotFoundResponse()
    @ApiOkResponse()
    @RolesDecorator(AccessLevel.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('add/:id')
    async setRole(
        @Param('id', ParseIntPipe) userId: number,
        @Body() setRoleDto: SetRoleDto
    ): Promise<void> {
        await this.rolesService.setRole(userId, setRoleDto);
    }

    // Use this request when you firstly start the app, it will init all the needed roles
    // There is no need to use it after
    // OR you can add roles by own in database
    @Post('init')
    initRoles() {
        this.rolesService.initRoles();
    }
}
