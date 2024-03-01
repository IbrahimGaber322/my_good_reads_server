class AppError extends Error
{
    constructor(message, status)
    {
        super(message);
        this.status = status || 500;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;

