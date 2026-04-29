/**
 * @swagger
 * /api/v1/chatbot:
 *   post:
 *     summary: Send a question to chatbot
 *     tags: [ChatBot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return chatbot answer
 *       400:
 *         description: Question is required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/chatbot/history:
 *   get:
 *     summary: Get all user's chat history
 *     tags: [ChatBot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return user's chat history
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */