const PostsRepository = require('../../../src/repositories/posts.repository');
const {
  createPostInsertSchemaByRepository,
  findPostInsertSchema,
  updatePostInsertSchema,
  deletePostInsertSchema,
} = require('../../fixtures/posts.fixtures');

const mockPostsModel = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
});

describe('posts Repository Layer Test', () => {
  let postsRepository = new PostsRepository();
  // Model Mocking
  postsRepository.postsModel = mockPostsModel();

  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  });

  test('createPost Method toHaveBeenCalled', async () => {
    await postsRepository.createPost(createPostInsertSchemaByRepository);

    // create 메소드 호출 횟수 = 1
    expect(postsRepository.postsModel.create).toHaveBeenCalledTimes(1);

    // create 메소드가 호출된 인자를 검증
    expect(postsRepository.postsModel.create).toHaveBeenCalledWith(
      createPostInsertSchemaByRepository,
    );
  });

  test('findAllPosts Method toHaveBeenCalled', async () => {
    await postsRepository.findAllPosts({});

    expect(postsRepository.postsModel.findAll).toHaveBeenCalledTimes(1);
  });

  test('findPostById Method toHaveBeenCalled', async () => {
    await postsRepository.findPostById(findPostInsertSchema);

    expect(postsRepository.postsModel.findOne).toHaveBeenCalledTimes(1);
  });

  test('updatePost Method toHaveBeenCalled', async () => {
    await postsRepository.updatePost(updatePostInsertSchema);

    expect(postsRepository.postsModel.update).toHaveBeenCalledTimes(1);
  });

  test('deletePost Method toHaveBeenCalled', async () => {
    await postsRepository.deletePost(deletePostInsertSchema);

    expect(postsRepository.postsModel.destroy).toHaveBeenCalledTimes(1);
  });
});
