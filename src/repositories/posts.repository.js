class PostsRepository {
  constructor(PostsModel, UsersModel, CommentsModel) {
    this.postsModel = PostsModel;
    this.usersModel = UsersModel;
    this.commentsModel = CommentsModel;
  }

  createPost = async (UserId, title, content, image) => {
    const createPostData = await this.postsModel.create({
      UserId,
      title,
      content,
      image,
    });
    console.log(createPostData);
    return createPostData;
  };

  findAllPosts = async () => {
    try {
      const posts = await this.postsModel.findAll({
        attributes: ['id', 'title', 'createdAt', 'updatedAt'],
        include: [
          {
            model: this.usersModel,
            as: 'User', // Users로부터 hasMany - belongsTo로 가져와서 단수로 써줘야함
            attributes: ['id', 'nickname'],
          },
          { model: this.usersModel, as: 'likePostId', attributes: ['id'] },
          { model: this.commentsModel, as: 'Comments', attributes: ['PostId'] }, // Comments가 belongsTo여서 Comments로 써야함
        ],
      });
      return posts;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = PostsRepository;
