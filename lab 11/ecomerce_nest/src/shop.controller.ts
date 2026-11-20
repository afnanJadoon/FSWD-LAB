import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const file = path.join(process.cwd(), 'data.json');

function readData() {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveData(data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function checkAuthentication(req: any) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    throw new UnauthorizedException('Bearer token is required');
  }
}

function checkAuthorization(req: any, role: string) {
  if (req.headers['x-user-role'] !== role) {
    throw new ForbiddenException('You do not have permission');
  }
}

@Controller('api')
export class ShopController {
  // ---------- PRODUCTS ----------
  @Get('products')
  getProducts(@Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    return readData().products;
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    const product = readData().products.find((p) => p.id === Number(id));

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Post('products')
  addProduct(@Body() body: any, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'admin');
    const data = readData();

    if (!body.name || body.price == null) {
      throw new BadRequestException('Name and price are required');
    }

    const product = {
      id: Date.now(),
      name: body.name,
      price: Number(body.price),
    };

    data.products.push(product);
    saveData(data);

    return product;
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'admin');
    const data = readData();
    const product = data.products.find((p) => p.id === Number(id));

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (body.name !== undefined) product.name = body.name;
    if (body.price !== undefined) product.price = Number(body.price);

    saveData(data);
    return product;
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'admin');
    const data = readData();
    const oldLength = data.products.length;

    data.products = data.products.filter((p) => p.id !== Number(id));

    if (data.products.length === oldLength) {
      throw new NotFoundException('Product not found');
    }

    saveData(data);
    return { message: 'Product deleted' };
  }

  // ---------- CART ----------
  @Get('cart')
  getCart(@Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    return readData().cart;
  }

  @Post('cart')
  addToCart(@Body() body: any, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    const data = readData();

    const product = data.products.find((p) => p.id === Number(body.productId));

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const item = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: Number(body.quantity) || 1,
    };

    data.cart.push(item);
    saveData(data);

    return item;
  }

  @Delete('cart/:id')
  removeFromCart(@Param('id') id: string, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    const data = readData();
    const oldLength = data.cart.length;

    data.cart = data.cart.filter((item) => item.id !== Number(id));

    if (data.cart.length === oldLength) {
      throw new NotFoundException('Cart item not found');
    }

    saveData(data);
    return { message: 'Item removed from cart' };
  }

  // ---------- ORDERS ----------
  @Get('orders')
  getOrders(@Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    return readData().orders;
  }

  @Post('orders')
  placeOrder(@Body() body: any, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    const data = readData();

    if (data.cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const total = data.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = {
      id: Date.now(),
      customer: body.customer || 'Guest',
      items: data.cart,
      total: total,
    };

    data.orders.push(order);
    data.cart = [];

    saveData(data);

    return order;
  }

  // ---------- REVIEWS ----------
  @Get('reviews')
  getReviews(@Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    return readData().reviews;
  }

  @Post('reviews')
  addReview(@Body() body: any, @Req() req: any) {
    checkAuthentication(req);
    checkAuthorization(req, 'customer');
    const data = readData();

    if (!body.productId || !body.comment) {
      throw new BadRequestException('Product ID and comment are required');
    }

    const review = {
      id: Date.now(),
      productId: Number(body.productId),
      comment: body.comment,
      rating: Number(body.rating) || 5,
    };

    data.reviews.push(review);
    saveData(data);

    return review;
  }
}
