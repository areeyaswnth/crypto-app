import { 
    Controller, 
    Post, 
    Body, 
    Param, 
    Delete, 
    UseGuards, 
    Request, 
    HttpException,
    HttpStatus,
    Logger,
    Get
  } from '@nestjs/common';
  import { TradeOrdersService } from '../services/trade-orders.service';
  import { CreateTradeOrderDto } from '../dtos/create-trade-order.dto';
  import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
  
  @Controller('trades')
  @UseGuards(JwtAuthGuard)
  export class TradeOrdersController {
    private readonly logger = new Logger(TradeOrdersController.name);
  
    constructor(private readonly tradeOrdersService: TradeOrdersService) {}
    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    async getTradeOrders(
        @Param('userId') userId: string,
        @Request() req
        ) {
        try {
            this.logger.log('Get Trade Orders Request', { userId, user: req.user });
    
            if (!req.user) {
            throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
            }
    
            const orders = await this.tradeOrdersService.getTradeOrders(userId);
    
            return orders;
        } catch (error) {
            this.logger.error('Get Trade Orders Error', error);
            
            throw new HttpException(
            error.message || 'Failed to retrieve trade orders', 
            error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        }
    @Get(':userId/:orderId')
    @UseGuards(JwtAuthGuard)
    async getTradeOrderById(
      @Param('userId') userId: string,
      @Param('orderId') orderId: string,
      @Request() req
    ) {
      try {
        this.logger.log('Get Trade Order by ID Request', { userId, orderId, user: req.user });
  
        if (!req.user) {
          throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
        }
  
        const order = await this.tradeOrdersService.getTradeOrderById(userId, orderId);
  
        return order;
      } catch (error) {
        this.logger.error('Get Trade Order by ID Error', error);
        
        throw new HttpException(
          error.message || 'Failed to retrieve trade order', 
          error.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createTradeOrder(
      @Body() createTradeOrderDto: CreateTradeOrderDto,
      @Request() req
    ) {
      try {
        this.logger.log('Create Trade Order Request', {
          dto: createTradeOrderDto,
          user: req.user
        });
  
        if (!req.user) {
          throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        const userId = req.user.user_id || req.user.id;
        if (!userId) {
          throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
        }
  
        const tradeOrder = await this.tradeOrdersService.createTradeOrder(
          createTradeOrderDto, 
          userId
        );
  
        return {
          message: 'Trade order created successfully',
          data: tradeOrder
        };
      } catch (error) {
        this.logger.error('Create Trade Order Error', error);
        
        throw new HttpException(
          error.message || 'Failed to create trade order', 
          error.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  
   
  }