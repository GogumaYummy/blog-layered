const PostsRepository = require('../repositories/posts.repository.js');
const { Posts, Users, Comments } = require('../models/index.js');
const { ApiError } = require('../utils/apiError');
class PostsService {
  postsRepository = new PostsRepository(Posts, Users, Comments);

  createPost = async ({ UserId, title, content, image }) => {
    await this.postsRepository.createPost({
      UserId,
      title,
      content,
      image,
    });

    return true;
  };

  findAllPosts = async ({}) => {
    const allPosts = await this.postsRepository.findAllPosts({});

    if (!allPosts) {
      return null;
    } else {
      const posts = allPosts.map((post) => {
        return {
          id: post.id,
          title: post.title,
          likesNum: post.dataValues.likePostId.length,
          commentsNum: post.dataValues.Comments.length,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          User: post.dataValues.User,
        };
      });

      return posts;
    }
  };

  findPostById = async ({ postId }) => {
    const findPost = await this.postsRepository.findPostById({ postId });

    if (!findPost) {
      throw new ApiError('게시글이 존재하지 않습니다.', 400);
    } else {
      const post = {
        id: findPost.id,
        title: findPost.title,
        content: findPost.content,
        image: findPost.image,
        likesNum: findPost.dataValues.likePostId.length,
        commentsNum: findPost.dataValues.Comments.length,
        createdAt: findPost.createdAt,
        updatedAt: findPost.updatedAt,
        User: findPost.dataValues.User,
      };

      return post;
    }
  };

  updatePost = async ({ postId, title, content }) => {
    await this.postsRepository.updatePost({ postId, title, content });

    return true;
  };

  deletePost = async ({ postId }) => {
    await this.postsRepository.deletePost({ postId });

    return true;
  };
}

module.exports = PostsService;
