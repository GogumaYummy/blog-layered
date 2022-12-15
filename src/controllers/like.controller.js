const LikesService = require('../services/like.service.js');
// const PostsService = require('../services/posts.service.js');



class LikesController {
  // postsService = new PostsService();
  LikesService = new LikesService();

  getlikelist = async (req, res, next) => {
    try {
      const {userId} = req.params;

      const posts = await this.LikesService.getlikelist(userId);

      res.status(201).json({  posts });
    } catch (err) {
      next(err);
    }
  };

  postlike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals;
      // const post = await this.postsService.findPostById({ postId });
      await this.LikesService.postlike(postId, userId);

      res.status(201).json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } catch (err) {
      next(err);
    }
  };

  deletdlike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals;
      // const post = await this.postsService.findPostById({ postId });
      await this.LikesService.deletdlike(postId, userId);

      res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = LikesController;
