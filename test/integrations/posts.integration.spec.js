const supertest = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

const {
  createPostInsertSchemaByController,
  createPostRegister,
  createPostLogin,
  updatePost,
  createPostRegister2,
  createPostLogin2,
} = require('../fixtures/posts.fixtures');

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await db.sequelize.sync();
    // Users table 삭제하면 매번 계정 정보 새로 만들어야해서 적용 안함
    // await Users.destroy({ where: {} });
  } else throw new Error('NODE_ENV가 test로 설정되어 있지 않습니다.');
});

describe('Posts Domain', () => {
  beforeEach(() => {
    // 모든 Mock을 초기화합니다.
    jest.resetAllMocks();
  });

  let accessToken = '';

  test('GET localhost:5000/posts 최초 호출 시 아무런 데이터가 존재하지 않음.', async () => {
    const response = await supertest(app).get('/posts').send({});

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    expect(responseByJson.posts).toEqual([]);
  });

  test('POST localhost:5000/posts 최초 호출 시 Posts 생성', async () => {
    // test db에 계정 만들고  로그인
    await supertest(app).post('/auth/register').send(createPostRegister);
    const login = await supertest(app)
      .post('/auth/login')
      .send(createPostLogin);

    //accessToken에 Bearer 태그 붙이기
    accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;
    const post = await supertest(app)
      .post('/posts')
      .set('authorization', accessToken) // req.header.authorization에 accessToken 추가
      .send(createPostInsertSchemaByController);

    const postByJson = JSON.parse(post.text);

    expect(post.status).toEqual(201);
    // 해당 Object에서 특정 인자가 포함되어있는지 검증합니다.
    expect(postByJson).toEqual({
      message: '게시글 작성에 성공했습니다.',
    });
  });

  test('GET localhost:5000/posts 호출 시 전체 게시글 출력.', async () => {
    const response = await supertest(app).get('/posts').send({});

    const responseByJson = JSON.parse(response.text).posts[0];

    expect(response.status).toEqual(200);
    expect(responseByJson).toHaveProperty('id');
    expect(responseByJson).toHaveProperty('User.id');
    expect(responseByJson).toHaveProperty('User.nickname');
    expect(responseByJson).toHaveProperty('title');
    expect(responseByJson).toHaveProperty('likesNum');
    expect(responseByJson).toHaveProperty('commentsNum');
    expect(responseByJson).toHaveProperty('updatedAt');
    expect(responseByJson).toHaveProperty('createdAt');
  });

  test('GET localhost:5000/posts/postsId 호출 시 게시글 출력.', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    // Pk가 AI 적용되서 매 테스트마다 id값이 올라가는 관계로 새로 찾아줘야 한다
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // req.params로 postId 보내기
    const response = await supertest(app).get('/posts/' + postId); // /posts/:postId

    const responseByJson = JSON.parse(response.text).post;

    expect(response.status).toEqual(200);
    expect(responseByJson).toHaveProperty('id');
    expect(responseByJson).toHaveProperty('User.id');
    expect(responseByJson).toHaveProperty('User.nickname');
    expect(responseByJson).toHaveProperty('title');
    expect(responseByJson).toHaveProperty('content');
    expect(responseByJson).toHaveProperty('image');
    expect(responseByJson).toHaveProperty('likesNum');
    expect(responseByJson).toHaveProperty('commentsNum');
    expect(responseByJson).toHaveProperty('updatedAt');
    expect(responseByJson).toHaveProperty('createdAt');
  });

  test('GET localhost:5000/posts/postsId 게시글 없을 때 Error Case.', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾고 + 1 해주기 (= 없는 게시글 번호)
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'] + 1;

    // req.params로 postId 보내기
    const response = await supertest(app).get('/posts/' + postId);
    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(400);
    expect(responseByJson.errorMessage).toEqual('게시글이 존재하지 않습니다.');
  });

  test('PUT localhost:5000/posts/postsId 게시글 수정', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // updatePost 접근
    const response = await supertest(app)
      .put('/posts/' + postId) // req.params에서 postId 받기
      .set('authorization', accessToken) // accessToken 설정
      .send({ ...updatePost, postId: postId }); // update할 내용 (title, content) 보내기

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    // 해당 Object에서 특정 인자가 포함되어있는지 검증합니다.
    expect(responseByJson).toEqual({
      message: '게시글 수정에 성공했습니다.',
    });
  });

  test('PUT localhost:5000/posts/postsId Invalid Body Error Case', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // updatePost 접근
    const response = await supertest(app)
      .put('/posts/' + postId) // req.params에서 postId 받기
      .set('authorization', accessToken) // accessToken 설정
      .send({ ...updatePost, postId: postId, title: null }); // title null로 바꾸기

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(400);
    expect(responseByJson.errorMessage).toEqual(
      '게시글 제목/내용을 입력해주세요.',
    );
  });

  test('PUT localhost:5000/posts/postsId 게시글 작성자 Error Case', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // accessToken 비우기
    accessToken = '';

    // 다른 계정 회원가입/로그인
    await supertest(app).post('/auth/register').send(createPostRegister2);
    const login = await supertest(app)
      .post('/auth/login')
      .send(createPostLogin2);

    //accessToken에 Bearer 태그 붙이기
    accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;
    const response = await supertest(app)
      .put('/posts/' + postId)
      .set('authorization', accessToken)
      .send({ ...updatePost, postId: postId });

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(400);
    expect(responseByJson.errorMessage).toEqual('게시글 작성자가 아닙니다.');
  });

  test('DELETE localhost:5000/posts/postsId 게시글 작성자 Error Case', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // accessToken 비우기
    accessToken = '';

    // 다른 계정 회원가입/로그인
    await supertest(app).post('/auth/register').send(createPostRegister2);
    const login = await supertest(app)
      .post('/auth/login')
      .send(createPostLogin2);

    //accessToken에 Bearer 태그 붙이기
    accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;
    const response = await supertest(app)
      .delete('/posts/' + postId)
      .set('authorization', accessToken)
      .send({ ...updatePost, postId: postId });

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(400);
    expect(responseByJson.errorMessage).toEqual('게시글 작성자가 아닙니다.');
  });

  test('PUT localhost:5000/posts/postsId 게시글 삭제', async () => {
    // 게시글 전부 불러온 후 Posts의 Pk 찾기
    const posts = await supertest(app).get('/posts').send({});
    const postId = JSON.parse(posts.text).posts[0]['id'];

    // accessToken 비우기
    accessToken = '';

    // 첫 계정으로 로그인
    const login = await supertest(app)
      .post('/auth/login')
      .send(createPostLogin);
    accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;

    // updatePost 접근
    const response = await supertest(app)
      .delete('/posts/' + postId) // req.params에서 postId 받기
      .set('authorization', accessToken) // accessToken 설정
      .send({ ...updatePost, postId: postId }); // update할 내용 (title, content) 보내기

    const responseByJson = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    // 해당 Object에서 특정 인자가 포함되어있는지 검증합니다.
    expect(responseByJson).toEqual({
      message: '게시글 삭제에 성공했습니다.',
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await db.sequelize.sync({ force: true });
  } else throw new Error('NODE_ENV가 test로 설정되어 있지 않습니다.');
});
