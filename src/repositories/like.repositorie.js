const express = require('express');
const { ApiError } = require('../utils/apiError');
const router = express.Router();
const { LikedPost } = require('../models');
const { Users, Posts } = require('../models');

class LikeRepository {
  getlikelist = async (userId) => {
    const user = await Users.findByPk(userId);

    const likes = user.getLikeUserId();

    return likes;
  };

  postlike = async (postId, userId) => {
    const user = await Users.findByPk(userId);

    if (!user) throw new ApiError('유저가 없다.', 404);

    const post = await Posts.findByPk(postId);

    if (!post) throw new ApiError('글이 없다.', 404);

    user.addLikeUserId(post);
  };

  deletdlike = async (postId, userId) => {
    const user = await Users.findByPk(userId);

    if (!user) throw new ApiError('유저가 없다.', 404);

    const post = await Posts.findByPk(postId);

    if (!post) throw new ApiError('글이 없다.', 404);

    user.removeLikeUserId(post);
  };
}

module.exports = LikeRepository;
