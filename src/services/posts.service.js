const PostsRepository = require('../repositories/posts.repository.js');
const { Posts } = require('../models/index.js');

class PostsService {
  postsRepository = new PostsRepository(Posts);

  createPost = async (UserId, title, content, image) => {
    const createPostData = await this.postsRepository.createPost(
      UserId,
      title,
      content,
      image,
    );

    return {
      UserId: createPostData.UserId,
      title: createPostData.title,
      content: createPostData.content,
      // createdAt: createPostData.createdAt,
      // updatedAt: createPostData.updatedAt,
    };
  };

  findAllPosts = async () => {
    const allPosts = await this.postsRepository.findAllPosts();

    allPosts.sort((a, b) => {
      return b.id - a.id;
    });

    return allPosts.map((post) => {
      return {
        id: post.id,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        // User: post.User,
      };
    });
  };
}

module.exports = PostsService;
