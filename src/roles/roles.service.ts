import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/roles.model';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/models/users.model';
import { SetRoleDto } from './dto/set-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role) private rolesRepository: typeof Role,
        private usersService: UsersService
    ) { }

    async getRole(roleTitle: string) {
        try {
            const role: Role = await this.rolesRepository.findOne({
                where: { title: roleTitle }
            })

            if (!role) {
                throw new HttpException(`There is no role with title ${roleTitle}`, HttpStatus.NOT_FOUND);
            }

            return role;
        } catch (err) {
            console.log(err);
        }
    }

    async setRole(userId: number, setRoleDto: SetRoleDto) {
        const user: User = await this.usersService.getUser(userId);
        const role: Role = await this.getRole(setRoleDto.roleTitle);

        user.role = role;
        await user.save();

        return HttpStatus.OK;
    }
}
