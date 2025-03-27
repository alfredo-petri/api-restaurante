import { AppError } from '@/utils/AppError'
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
    error: { message: string },
    request: Request,
    response: Response,
    _: NextFunction,
) => {
    if (error instanceof AppError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message })
    }

    if (error instanceof ZodError) {
        const formattedIssues = error.errors.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
            code: issue.code,
        }))

        return response.status(400).json({
            message: 'Validation error:',
            issues: formattedIssues,
        })
    }

    return response.status(500).json({ message: error.message })
}
