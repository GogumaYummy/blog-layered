/** Posts Repository Fixtures */
// createPost Input
exports.createPostInsertSchemaByRepository = {
  UserId: 0,
  title: 'title',
  content: 'content',
  image: 'image',
};

// findPostById Input
exports.findPostInsertSchema = { postId: 1 };

// updatePost Input
exports.updatePostInsertSchema = {
  postId: 2,
  title: 'update title',
  content: 'update content',
};

// deletePost Input
exports.deletePostInsertSchema = { postId: 3 };

/** Posts Service Fixtures */
exports.createPostInsertSchema = {
  UserId: 0,
  title: 'title',
  content: 'content',
  image: 'image',
};

exports.findPostInsertSchema = [
  {
    id: 0,
    title: 'title',
    createdAt: '2022-12-14T09:34:00.396Z',
    updatedAt: '2022-12-14T09:34:00.397Z',
    dataValues: {
      likePostId: [],
      Comments: [],
      User: {
        id: 'id',
        nickname: 'nickname',
      },
    },
  },
];

exports.findPostResultSchema = [
  {
    id: 0,
    title: 'title',
    likesNum: 0,
    commentsNum: 0,
    createdAt: '2022-12-14T09:34:00.396Z',
    updatedAt: '2022-12-14T09:34:00.397Z',
    User: {
      id: 'id',
      nickname: 'nickname',
    },
  },
];

exports.findPostByIdValue = { postId: 0 };

exports.findPostByIdInsertSchema = {
  id: 0,
  title: 'title',
  content: 'content',
  image: 'image',
  createdAt: '2022-12-14T09:34:00.396Z',
  updatedAt: '2022-12-14T09:34:00.397Z',
  dataValues: {
    likePostId: [],
    Comments: [],
    User: {
      id: 'id',
      nickname: 'nickname',
    },
  },
};

exports.findPostByIdResultSchema = {
  id: 0,
  title: 'title',
  content: 'content',
  image: 'image',
  likesNum: 0,
  commentsNum: 0,
  createdAt: '2022-12-14T09:34:00.396Z',
  updatedAt: '2022-12-14T09:34:00.397Z',
  User: {
    id: 'id',
    nickname: 'nickname',
  },
};

exports.updatePostInsertSchema = {
  postId: 0,
  title: 'title',
  content: 'content',
};

exports.deletePostInsertSchema = { postId: 0 };

/** Posts Controller Fixtures */
exports.createPostInsertSchemaByController = {
  title: 'title',
  content: 'content',
  image: 'image',
};

exports.createPostResultSchemaByController = {
  UserId: 0,
  title: 'title',
  content: 'content',
  image: 'image',
};

exports.updatePostInsertSchemaByController = {
  title: 'title',
  content: 'content',
};

exports.updatePostResultSchemaByController = {
  postId: 0,
  title: 'title',
  content: 'content',
};

exports.findPostByIdResultSchemaByController = {
  id: 0,
  title: 'title',
  content: 'content',
  image: 'image',
  likesNum: 0,
  commentsNum: 0,
  createdAt: '2022-12-14T09:34:00.396Z',
  updatedAt: '2022-12-14T09:34:00.397Z',
  User: {
    id: 0,
  },
};

/** Posts Integration Test */
exports.createPostRegister = {
  email: 'email@email.com',
  nickname: 'nickname',
  password: '1234',
  confirm: '1234',
};

exports.createPostLogin = {
  email: 'email@email.com',
  password: '1234',
};

exports.updatePost = {
  title: 'title update',
  content: 'content update',
};

exports.createPostRegister2 = {
  email: 'email1@email.com',
  nickname: 'nickname1',
  password: '1234',
  confirm: '1234',
};

exports.createPostLogin2 = {
  email: 'email1@email.com',
  password: '1234',
};
