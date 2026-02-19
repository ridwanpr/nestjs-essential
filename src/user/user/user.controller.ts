import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  // UseFilters,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service.js';
import { Connection } from '../connection/connection.js';
import { MailService } from '../mail/mail.service.js';
import { UserRepository } from '../user-repository/user-repository.js';
import { MemberService } from '../member/member.service.js';
// import { ValidationFilter } from '../../validation/validation.filter.js';
import type { LoginUserRequest } from '../../model/login.model.js';
import { loginUserRequestSchema } from '../../model/login.model.js';
import { ValidationPipe } from '../../validation/validation.pipe.js';
import { TimeInterceptor } from '../../time/time.interceptor.js';
import { Auth } from '../../auth/auth.decorator.js';
import type { User } from '../../generated/prisma/client.js';
import { RoleGuard } from '../../role/role.guard.js';
// import { ValidationFilter } from '../../validation/validation.filter.js';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepo: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/current')
  @UseGuards(new RoleGuard(['admin', 'operator']))
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  // @UseFilters(ValidationFilter)
  @Post('/login')
  @Header('Content-type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(
    @Body(new ValidationPipe(loginUserRequestSchema)) request: LoginUserRequest,
  ) {
    return {
      data: `Hello ${request.username}`,
    };
  }

  // gunakan Decorator Nest seperti @Query, @Param dsb
  // decorator dapat lebih dari satu
  @Get('/user/hello')
  // @UseFilters(ValidationFilter)
  sayHello(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  @Get('/connection')
  getConnection(): string {
    this.mailService.send();
    this.emailService.send();

    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  @Get('/create')
  async create(
    @Query('firstname') firstname: string,
    @Query('lastname') lastname: string,
  ): Promise<{ id: number; first_name: string; last_name: string | null }> {
    if (!firstname) {
      throw new HttpException(
        {
          code: 400,
          errors: 'firstname is required',
        },
        400,
      );
    }

    const user = await this.userRepo.save(firstname, lastname);
    return {
      id: Number(user.id),
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }

  // tidak direkomendasikan menggunakan Response express
  //   @Get('/sample-response')
  //   sampleResponse(@Res() response: Response) {
  //     response.status(200).json({ message: 'Sample Response' });
  //   }

  //   pengecualian seperti untuk cookie dimana perlu response dari express
  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send(`Set Cookie Success: ${name}`);
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request) {
    const name = request.cookies.name as string;
    if (!name) return 'Cookie not set';
    return `Cookie: ${name}`;
  }

  // gunakan Decorator nest
  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): { data: string } {
    return {
      data: 'Hello Json',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/sample')
  index(): string {
    return 'GET';
  }

  @Post()
  store(): string {
    return 'POST';
  }

  // tidak direkomendasikan menggunakan @Req
  @Get('/:id')
  //   show(@Req() request: Request<{ id: string }>): string {
  //     return `Get ${request.params.id}`;
  //   }
  // PIPE
  show(@Param('id', ParseIntPipe) id: number): string {
    const result = id * 10;
    return `${id} * 10 = ${result}`;
  }

  // render mustache view
  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() res: Response) {
    res.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }
}
