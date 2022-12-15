const LikeRepository = require('../../../src/repositories/like.repositorie');
const { ApiError } = require('../../../src/utils/apiError');

const mockLikeModel = () => ({
  getlikelist: jest.fn(),
  postlike: jest.fn(),
  deletdlike: jest.fn(),
});

describe('likepost Repository Layer Test', () => {
  let likeRepository = new LikeRepository();

  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  });

  test('getlikelist Repository test', () => {
    //몇번 호출되었는지 확인.
    expect(likeRepository.getlikelist({ uesrId: 1 })).toHaveBeenCalledTimes(1);
    expect(likeRepository.getlikelist(1)).toBe(1);
  });

  test('getlikelist Repository test', () => {
    //몇번 호출되었는지 확인.
    expect(likeRepository.postlike({ uesrId: 1, postId: 1 })
    ).toHaveBeenCalledTimes(1);
    expect(likeRepository.postlike(1)).toBe(1);
  });

  test('getlikelist Repository test', () => {
    //몇번 호출되었는지 확인.
    expect(likeRepository.deletdlike({ uesrId: 1, postId: 1 }) ).toHaveBeenCalledTimes(1);
    expect(likeRepository.deletdlike(1)).toBe(1);
  });
});
