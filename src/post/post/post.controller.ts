import { Controller,Get,Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/post')
@ApiTags('Post')
export class PostController {
    @Get()
    findOne() {
		  return 'this function returns one post'; 
    }
  
  	@Post()
  	findAll() {
      return 'this function returns all posts';
    }
}
