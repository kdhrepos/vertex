import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
	private logger = new Logger("HTTP");

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl, body, query } = request;

		this.logger.log(`Request [${method}] ${originalUrl}`, body);

		next();
	}
}
