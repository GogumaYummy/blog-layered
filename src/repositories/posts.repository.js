class PostsRepository {
  constructor(PostsModel) {
    this.postsModel = PostsModel;
  }

  createPost = async (UserId, title, content) => {
    const createPostData = await this.postsModel.create({
      // id,
      UserId,
      title,
      content,
    });

    return createPostData;
  };

  findAllPosts = async () => {
    const posts = await this.postsModel.findAll({
      attributes: [
        'id',
        'title',
        [Sequelize.fn('COUNT', Sequelize.col('LikedPosts.PostId')), 'likesNum'],
        [Sequelize.fn('COUNT', Sequelize.col('Comment.PostId')), 'commentsNum'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        { model: Users, attributes: ['id', 'nickname'] },
        { model: Users, as: 'LikedPosts', attributes: [] },
        { model: Comments, attributes: [] },
      ],
    });

    return posts;
  };
}

module.exports = PostsRepository;
