import {
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('/api/users')
export class UserController {
  // tidak direkomendasikan menggunakan Response express
  //   @Get('/sample-response')
  //   sampleResponse(@Res() response: Response) {
  //     response.status(200).json({ message: 'Sample Response' });
  //   }

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

  // gunakan Decorator Nest seperti @Query, @Param dsb
  // decorator dapat lebih dari satu
  @Get('/user/hello')
  sayHello(
    @Query('firstname') firstname: string,
    @Query('lastname') lastname: string,
  ): string {
    return `Hello ${firstname} ${lastname}`;
  }
}
