import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { Post } from './models/posts.model';
import { EditPostDto } from './dto/edit-post.dto';
import { Complaint } from 'src/complaints/models/complaints.model';
import { User } from 'src/users/models/users.model';
import { Like } from './models/likes.model';
import { AccessLevel } from 'src/roles/common/role.common';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post) private postsRepository: typeof Post,
        @InjectModel(Like) private likesRepository: typeof Like,
        private usersService: UsersService
    ) { }

    async createPost(userId: number, createPostDto: CreatePostDto) {
        const user: User = await this.usersService.getUser(userId);
        const post: Post = await this.postsRepository.create(
            { ...createPostDto, userId },
            { include: [Like] }
        );

        user.posts.push(post);

        return post;
    }

    async getPost(id: number) {
        const post: Post = await this.postsRepository.findOne({
            where: { id },
            include: [Complaint, User, Like],
        });

        if (!post) throw new NotFoundException(`Post with id ${id} hasn't been found`);

        return post;
    }

    async getAllPosts() {
        const posts: Post[] = await this.postsRepository.findAll();

        if (!posts.length) throw new NotFoundException("There are no posts");

        return posts;
    }

    async editPost(userId: number, postId: number, editPostDto: EditPostDto) {
        await this.getPost(postId);

        const [, [updatedPost]] = await this.postsRepository.update(
            {
                ...editPostDto,
                userId,
            },
            {
                where: { id: postId },
                returning: true,
            },
        )

        return updatedPost;
    }

    async removePost(userId: number, postId: number) {
        const post: Post = await this.getPost(postId);

        if (post.userId === userId) {
            await post.destroy();
        } else {
            const user: User = await this.usersService.getUser(userId);

            if (user.role.accessLevel >= AccessLevel.ADMIN) await post.destroy();
            else throw new ForbiddenException(`User ${user.username} with id ${userId} can't remove post of other`);
        }
    }

    async handleLike(postId: number, userId: number) {
        const user: User = await this.usersService.getUser(userId);
        const post: Post = await this.getPost(postId);

        const usersLike: Like = await this.likesRepository.findOne({
            where: { userId, postId },
        })

        if (usersLike) {
            post.likes = post.likes.filter((like) => like.id !== usersLike.id);
            await post.save();

            await this.usersService.removeLike(user, usersLike.id);

            await usersLike.destroy();
        } else {
            const like: Like = await this.likesRepository.create({ userId, postId }, { include: [Post, User] });
            like.post = post;
            like.user = user;
            await like.save();

            !post.likes ? post.likes = [like] : post.likes.push(like);
            await post.save();

            !user.likes ? user.likes = [like] : user.likes.push(like);
            await user.save();
        }

        return post.likes.length;
    }
}
