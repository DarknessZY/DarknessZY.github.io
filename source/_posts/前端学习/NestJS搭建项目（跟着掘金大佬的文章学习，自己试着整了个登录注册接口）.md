---
title: NestJS 建项目
date: 2023-03-15 13:30
tags: [Nest]
categories: [项目搭建]
---

# 前言

> 学习NestJS，主要看了
> [学完这篇 Nest.js 实战，还没入门的来锤我！(长文预警) - 掘金 (juejin.cn)](https://juejin.cn/post/7032079740982788132#heading-22)，也是跟着整时做一个笔记，大佬讲已经很清晰了，不出意外真入门了，然后试着写了登录注册的接口，成功的那一刻还是挺开心的！！！

## 安装

我是按照官网的Nest CLI创建的项目，也是官网推荐初学者使用的方式:

若要使用 Nest CLI 构建项目，请运行以下命令。这将创建一个新的项目目录，并使用核心的 Nest 文件和支撑模块填充该目录，从而为项目创建一个传统的基本结构。

```js
$ npm i -g @nestjs/cli
$ nest new project-name
```
运行完命令后：

![1678264171764.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c74eaaa078c4538849c0f7ad31fd6f0~tplv-k3u1fbpfcp-watermark.image?)

这里简单说明一下这些核心文件：

```
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts


| ------------------------ | ------------------------------------------------- |
| `app.controller.ts`      | 单个路由的基本控制器(Controller)                            |
| `app.controller.spec.ts` | 针对控制器的单元测试                                        |
| `app.module.ts`          | 应用程序的根模块(Module)                                  |
| `app.service.ts`         | 具有单一方法的基本服务(Service)                              |
| `main.ts`                | 应用程序的入口文件，它使用核心函数 `NestFactory` 来创建 Nest 应用程序的实例。 |
```
具体可以去看这位大佬写的文章，非常好！我后面也是跟着这篇文章学习的

怎么连接数据库，接口规范统一，swagger等我都是按下面链接的大佬的文章学习的，然后也算是入了门，才开始试试登录注册的。

[学完这篇 Nest.js 实战，还没入门的来锤我！(长文预警) - 掘金 (juejin.cn)](https://juejin.cn/post/7032079740982788132#heading-22)

## 登录注册
### 全局路由前缀
上面链接的大佬有提过，在main.ts

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(8080);
}
bootstrap();
```
此时之前的路由，都要变更为：http://localhost/api/xxxx
### 创建 USER 模块

```js
nest g mo modules/user //创建moudle
nest g co modules/user //创建控制器
nest g s modules/user //创建服务
```
**注意创建顺序**： 先创建`Module`, 再创建`Controller`和`Service`, 这样创建出来的文件在`Module`中自动注册，反之，后创建Module, `Controller`和`Service`,会被注册到外层的`app.module.ts`

![1678265171776.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7277a852f1447debd184e9127a8bcea~tplv-k3u1fbpfcp-watermark.image?)

### user表实体
新建 user.entity.ts 实体，到时候可以通过`TypeORM`将实体映射到数据库表

```js
// 用户实体类
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('User')
export class UserEntity {
  // 用户id
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  // 昵称
  @Column({default:''})
  nickname: string;

  //头像
  @Column({default:'https://i.postimg.cc/wjcFjQMD/b.png'})
  avatar: string;
  
  // 手机号
  @Column('text')
  mobile: string;

  // 创建时间
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  // 更新时间
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  // 加密后的密码
  @Column('text', { select: false })
  password: string;

  // 加密盐
  @Column('text', { select: false })
  salt: string;
}

```
### user.dto
`Nest.js`自带了三个开箱即用的管道：`ValidationPipe`、`ParseIntPipe`和`ParseUUIDPipe`, 其中`ValidationPipe` 配合`class-validator`就可以完美的实现我们想要的效果（对参数类型进行验证，验证失败抛出异常）。

新建user.dto.ts用于校验，完善错误提示信息

```js
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ description: '昵称' })
  readonly nickname: string;

  @ApiProperty({ description: '头像' })
  readonly avatar: string;

  @ApiProperty({ description: '手机号' })
  readonly mobile: string;

  @IsNotEmpty({ message: '密码没填' })
  @ApiProperty({ description: '密码' })
  readonly password: string;
}

export class LoginInfoDTO {
  @IsNotEmpty({ message: '手机号没填' })
  @ApiProperty({ description: '手机号' })
  readonly mobile: string;

  @IsNotEmpty({ message: '密码没填' })
  @ApiProperty({ description: '密码' })
  readonly password: string;
}
```
### user控制层
在user.controller.ts 控制层定义接口

```js
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService:UserService) {

  }
  //注册
  @ApiOperation({ summary: '注册用户' })
  @Post('register')
  async register(@Body() createUser:any) {
     return await this.userService.register(createUser);
   }

  //登录
  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(@Body() loginInfo:any) {
    return await this.userService.login(loginInfo);
  }  
}

```

### user业务层
在user.service.ts写登录注册相关的业务逻辑

```js
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encryptPassword, makeSalt } from 'utils/cryptogram';
import { RegisterDTO , LoginInfoDTO} from './user.dto';
import { UserEntity} from './user.entity'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}
    /**
   * 注册
   * @param  mobile 手机号 
   * @param  password 密码 
   */
    async register(createUser:RegisterDTO):Promise<any>{
      const {mobile,password} = createUser;
      if (!mobile) {
        throw new HttpException('入参缺少mobile', 401);
      }
      const existUser = await this.userRepository.findOne({where: {mobile}});
      if (existUser) {
        throw new HttpException('该用户已注册', 401);
      }
      const newUser = await this.userRepository.create(createUser)
      const salt = makeSalt(); // 制作密码盐
      const hashPassword = encryptPassword(password, salt);  // 加密密码
      newUser.password = hashPassword
      newUser.salt = salt
      // this.userRepository.create(createUser)相当于new User(createUser)只是创建了一个新的用户对象
      // save方法才是执行插入数据
      return await this.userRepository.save(newUser);
    }

    /**
   * 登录检验
   * @param  mobile 手机号 
   * @param  password 密码 
   */
    async checkLoginForm(loginInfo:LoginInfoDTO):Promise<any> {
      const {mobile,password} = loginInfo;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.salt')
        .addSelect('user.password')
        .where('user.mobile = :mobile', { mobile })
        .getOne()
      if (!user) {
        throw new BadRequestException('用户名不正确！');
      }
      const currentHashPassword = encryptPassword(password, user.salt)
      if (currentHashPassword !== user.password) {
        throw new BadRequestException('密码错误')
      }
      return user
    }

   /**
   * 生成token
   * @param  UserEntity 用户实体类
   */
  async certificate(user:UserEntity){
    const payload = { 
      id: user.id,
      mobile: user.mobile,
    };
    const token = this.jwtService.sign(payload);
    return token
  }

   /**
   * 登录
   */
  async login(loginInfo:LoginInfoDTO):Promise<any> {
    const user = await this.checkLoginForm(loginInfo)
    const token = await this.certificate(user)
    return {
        token
    }
  }
}

```
> 其中需要注意jwt和user.entity的实体需要在user.module.ts中引入，然后把user.module暴露出去给app.module暴露出去给app导入，这样就建立了模块之间的关系，毕竟主模块是app.moudle


```js
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'dasdjanksjdasd', // 密钥
      signOptions: { expiresIn: '8h' }, // token 过期时效
    }),
  ],
 
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

```
## 成果
### 注册成功

![1678415253600.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ebcb18765764990937b444485bd0064~tplv-k3u1fbpfcp-watermark.image?)
### 登录成功，返回token
![1678415198199.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0c784a068a24e9e88e6d4f579306ddd~tplv-k3u1fbpfcp-watermark.image?)