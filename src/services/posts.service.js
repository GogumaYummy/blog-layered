const PostsRepository = require('../repositories/posts.repository.js');
const { Posts, Users, Comments } = require('../models/index.js');
class PostsService {
  postsRepository = new PostsRepository(Posts, Users, Comments);

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
      image: createPostData.image,
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
        title: post.title,
        likesNum: post.dataValues.likePostId.length,
        commentsNum: post.dataValues.Comments.length,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        User: post.dataValues.User,
      };
    });
  };
}

module.exports = PostsService;
