const PostsService = require('../../../src/services/posts.service');
const { ApiError } = require('../../../src/utils/apiError');

const {
  createPostInsertSchema,
  findPostInsertSchema,
  findPostResultSchema,
  findPostByIdValue,
  findPostByIdInsertSchema,
  findPostByIdResultSchema,
  updatePostInsertSchema,
  deletePostInsertSchema,
} = require('../../fixtures/posts.fixtures');

const mockPostsRepository = () => ({
  createPost: jest.fn(),
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
});

describe('posts Service Layer Test', function () {
  let postsService = new PostsService();
  // Repository를 Mocking
  postsService.postsRepository = mockPostsRepository();

  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  });

  test('createPost Method toHaveBeenCalled', async () => {
    await postsService.createPost(createPostInsertSchema);

    // Repository의 createPost가 메소드가 몇번 호출되었는지 확인
    expect(postsService.postsRepository.createPost).toHaveBeenCalledTimes(1);

    // createPost 메소드 호출시 값 검증
    expect(postsService.postsRepository.createPost).toHaveBeenCalledWith(
      createPostInsertSchema,
    );
  });

  test('findAllPosts Method Success Case', async () => {
    // Repository의 findAllPosts Mock 결과값
    postsService.postsRepository.findAllPosts = jest.fn(
      () => findPostInsertSchema,
    );

    const allPosts = await postsService.findAllPosts({});
    // Repository의 findAllPosts 메소드가 몇번 호출되었는지 확인
    expect(postsService.postsRepository.findAllPosts).toHaveBeenCalledTimes(1);

    // Repo와 Service의 결과값이 같은지 비교
    expect(allPosts).toEqual(findPostResultSchema);
  });

  test('findPostById Method Success Case', async () => {
    // Repository의 findPostById Mock 결과값
    postsService.postsRepository.findPostById = jest.fn(
      () => findPostByIdInsertSchema,
    );

    const findPost = await postsService.findPostById({ findPostByIdValue });

    // Repository의 findPostById 메소드가 몇번 호출되었는지 확인
    expect(postsService.postsRepository.findPostById).toHaveBeenCalledTimes(1);

    // Repo와 Service의 결과값이 같은지 비교
    expect(findPost).toEqual(findPostByIdResultSchema);
  });

  test('findPostById Method Fail Case by Invalid postId', async () => {
    // Repository의 findPostById Mock 결과값
    postsService.postsRepository.findPostById = jest.fn(() => null);

    try {
      const findPost = await postsService.findPostById({ findPostByIdValue });
    } catch (err) {
      // Repository의 findPostById 메소드가 몇번 호출되었는지 확인
      expect(postsService.postsRepository.findPostById).toHaveBeenCalledTimes(
        1,
      );

      // 에러가 ApiError Class인지 검증
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toEqual('게시글이 존재하지 않습니다.');
    }
  });

  test('updatePost Method toHaveBeenCalled', async () => {
    await postsService.updatePost({ updatePostInsertSchema });
    // Repository의 updatePost 메소드가 몇번 호출되었는지 확인
    expect(postsService.postsRepository.updatePost).toHaveBeenCalledTimes(1);
  });

  test('deletePost Method toHaveBeenCalled', async () => {
    await postsService.deletePost({ deletePostInsertSchema });
    // Repository의 deletePost 메소드가 몇번 호출되었는지 확인
    expect(postsService.postsRepository.deletePost).toHaveBeenCalledTimes(1);
  });
});
