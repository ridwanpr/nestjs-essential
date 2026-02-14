import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import httpMocks from 'node-mocks-http';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should can say hello', () => {
    const response = controller.sayHello('Hizuki', 'Yui');
    expect(response).toBe('Hello Hizuki Yui');
  });

  it('should can get view', () => {
    const response = httpMocks.createResponse();
    controller.viewHello('Hizuki', response);

    expect(response._getStatusCode()).toBe(200);
    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      name: 'Hizuki',
      title: 'Template Engine',
    });
  });
});
