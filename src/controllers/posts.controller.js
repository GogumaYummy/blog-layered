const PostsService = require('../services/posts.service.js');
const { ApiError } = require('../utils/apiError');
const logger = require('../config/logger');

class PostsController {
  // constructor() {
  //   this.postsService = new PostsService();
  // }
  postsService = new PostsService();

  createPost = async (req, res, next) => {
    try {
      // const { UserId } = res.locals.user;
      const { UserId, title, content, image } = req.body;

      if (!title || !content) {
        throw new ApiError('게시글 제목/내용을 입력해주세요.');
      }
      const createPostData = await this.postsService.createPost(
        UserId,
        title,
        content,
        image,
      );

      res.status(201).json({ data: createPostData });
    } catch (err) {
      logger.error(err);
    }
  };

  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();
      res.status(200).json({ posts: posts });
    } catch (err) {
      logger.error(err);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await this.postsService.findPostById(id);

      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다');
      }
      res.status(200).json({ post });
    } catch (err) {
      logger.error(err);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      // const { UserId } = res.locals.user;
      const { id } = req.params;
      const { UserId, title, content } = req.body;

      // 게시글 존재하는지 확인
      const post = await this.postsService.findPostById(id);
      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다.');
      }

      // 로그인한 계정이 게시글 작성자인지 확인
      if (post.UserId !== UserId) {
        throw new ApiError('게시글이 작성자가 아닙니다.');
      }

      // 게시글 제목 있는지 확인
      if (!title) {
        throw new ApiError('게시글 제목을 입력해주세요.');
      }

      const updatePost = await this.postsService.updatePost(id, title, content);

      res.status(200).json({ data: updatePost });
    } catch (err) {
      logger.error(err);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      // const { UserId } = res.locals.user;
      const { UserId } = req.body;
      const { id } = req.params;

      // 게시글 존재하는지 확인
      const post = await this.postsService.findPostById(id);
      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다.');
      }

      // 로그인한 계정이 게시글 작성자인지 확인
      if (post.UserId !== UserId) {
        throw new ApiError('게시글이 작성자가 아닙니다.');
      }

      const deletePost = await this.postService.deletePost(id);

      res.status(200).json({ data: deletePost });
    } catch (err) {
      logger.error(err);
    }
  };
}

module.exports = PostsController;
