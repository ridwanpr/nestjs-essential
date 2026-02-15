import {
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepo: UserRepository,
  ) {}

  // gunakan Decorator Nest seperti @Query, @Param dsb
  // decorator dapat lebih dari satu
  @Get('/user/hello')
  sayHello(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  @Get('/connection')
  getConnection(): string {
    this.userRepo.save();
    this.mailService.send();
    this.emailService.send();
    return this.connection.getName();
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
  show(@Param('id') id: string): string {
    return `Get ${id}`;
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
