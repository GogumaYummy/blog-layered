const PostsController = require('../../../src/controllers/posts.controller');
const { ApiError } = require('../../../src/utils/apiError');

const {
  createPostInsertSchemaByController,
  createPostResultSchemaByController,
  updatePostInsertSchemaByController,
  updatePostResultSchemaByController,
  findPostByIdResultSchemaByController,
} = require('../../fixtures/posts.fixtures');

const mockPostsService = () => ({
  createPost: jest.fn(),
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
});

let mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
};

let mockNext = jest.fn();

describe('posts Controller Layer Test', function () {
  let postsController = new PostsController();
  // Service를 Mocking
  postsController.postsService = mockPostsService();

  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  });

  test('createPost Method Success Case', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.body = createPostInsertSchemaByController;
    mockResponse.locals = Object.assign({}, { userId: 0 });

    await postsController.createPost(mockRequest, mockResponse, mockNext);

    // Service의 createPost가 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.createPost).toHaveBeenCalledTimes(1);

    // Service의 createPost 메소드 호출시 값 검증
    expect(postsController.postsService.createPost).toHaveBeenCalledWith(
      createPostResultSchemaByController,
    );

    // Service의 createPost 메소드 호출시 값 검증
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '게시글 작성에 성공했습니다.',
    });
  });

  test('createPost Method Fail Case by Invalid Body', async () => {
    mockRequest.body = { ...createPostInsertSchemaByController, title: null };
    mockResponse.locals = Object.assign({}, { userId: 0 });

    await postsController.createPost(mockRequest, mockResponse, mockNext);

    // Service의 createPost가 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.createPost).toHaveBeenCalledTimes(0);

    // Service의 createPost 메소드 호출시 값 검증
    const err = new ApiError('게시글 제목/내용을 입력해주세요.', 400);
    expect(mockNext).toHaveBeenCalledWith(err);
  });

  test('getPosts Method toHaveBeenCalled', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });

    // Service 보내주는 return 값
    postsController.postsService.findAllPosts = jest.fn(() => {
      return [];
    });

    await postsController.getPosts(mockRequest, mockResponse, mockNext);

    // Service의 findAllPosts 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.findAllPosts).toHaveBeenCalledTimes(1);

    // Service의 findAllPosts 메소드 호출시 값 검증
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ posts: [] });
  });

  test('getPostById Method toHaveBeenCalled', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });

    // Service 보내주는 return 값
    postsController.postsService.findPostById = jest.fn(() => {
      return {};
    });

    await postsController.getPostById(mockRequest, mockResponse, mockNext);

    // Service의 findAllPosts 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 findAllPosts 메소드 호출시 값 검증
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ post: {} });
  });

  test('updatePost Method Success Case', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.body = updatePostInsertSchemaByController;
    mockRequest.params = { postId: 0 };
    mockResponse.locals = Object.assign({}, { userId: 0 });

    postsController.postsService.findPostById = jest.fn(() => {
      return findPostByIdResultSchemaByController;
    });

    await postsController.updatePost(mockRequest, mockResponse, mockNext);

    // 게시글 존재 확인용 findPostById 호출 횟수 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.updatePost).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드 호출시 값 검증
    expect(postsController.postsService.updatePost).toHaveBeenCalledWith(
      updatePostResultSchemaByController,
    );

    // Service의 createPost 메소드 호출시 값 검증
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '게시글 수정에 성공했습니다.',
    });
  });

  test('updatePost Method Fail Case by Invalid UserId', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.body = updatePostInsertSchemaByController;
    mockRequest.params = { postId: 0 };
    mockResponse.locals = Object.assign({}, { userId: 1 });

    postsController.postsService.findPostById = jest.fn(() => {
      return findPostByIdResultSchemaByController;
    });

    await postsController.updatePost(mockRequest, mockResponse, mockNext);

    // 게시글 존재 확인용 findPostById 호출 횟수 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드 호출시 값 검증
    const err = new ApiError('게시글 작성자가 아닙니다.', 400);
    expect(mockNext).toHaveBeenCalledWith(err);
  });

  test('updatePost Method Fail Case by Invalid Body', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.body = { updatePostInsertSchemaByController, title: null };
    mockRequest.params = { postId: 0 };
    mockResponse.locals = Object.assign({}, { userId: 0 });

    postsController.postsService.findPostById = jest.fn(() => {
      return findPostByIdResultSchemaByController;
    });

    await postsController.updatePost(mockRequest, mockResponse, mockNext);

    // 게시글 존재 확인용 findPostById 호출 횟수 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드 호출시 값 검증
    const err = new ApiError('게시글 제목/내용을 입력해주세요.', 400);
    expect(mockNext).toHaveBeenCalledWith(err);
  });

  test('deletePost Method Success Case', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.params = { postId: 0 };
    mockResponse.locals = Object.assign({}, { userId: 0 });

    postsController.postsService.findPostById = jest.fn(() => {
      return findPostByIdResultSchemaByController;
    });

    await postsController.deletePost(mockRequest, mockResponse, mockNext);

    // 게시글 존재 확인용 findPostById 호출 횟수 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드가 몇번 호출되었는지 확인
    expect(postsController.postsService.deletePost).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드 호출시 값 검증
    expect(postsController.postsService.deletePost).toHaveBeenCalledWith(
      mockRequest.params,
    );

    // Service의 createPost 메소드 호출시 값 검증
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '게시글 삭제에 성공했습니다.',
    });
  });

  test('deletePost Method Fail Case by Invalid UserId', async () => {
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
    mockRequest.params = { postId: 0 };
    mockResponse.locals = Object.assign({}, { userId: 1 });

    postsController.postsService.findPostById = jest.fn(() => {
      return findPostByIdResultSchemaByController;
    });

    await postsController.deletePost(mockRequest, mockResponse, mockNext);

    // 게시글 존재 확인용 findPostById 호출 횟수 확인
    expect(postsController.postsService.findPostById).toHaveBeenCalledTimes(1);

    // Service의 updatePost 메소드 호출시 값 검증
    const err = new ApiError('게시글 작성자가 아닙니다.', 400);
    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
