const LikeRepository = require('../repositories/like.repositorie.js');
const { LikedPosts } = require('../models/index.js');

class LikesService {
  LikeRepository = new LikeRepository();
  getlikelist = async (userId) => {
    return await this.LikeRepository.getlikelist(userId);
  };

  postlike = async (postId, userId) => {
    return await this.LikeRepository.postlike(postId, userId);
  };

  deletdlike = async (postId, userId) => {
    return await this.LikeRepository.deletdlike(postId, userId);
  };
}

module.exports = LikesService;
