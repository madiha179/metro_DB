/**
 * @swagger
 * tags:
 *   - name: Tickets
 *     description: Ticket Management API
 */

/**
 * @swagger
 * /api/v1/tickets/getTicketIdByPrice:
 *   post:
 *     summary: Get ticket ID and calculate total price by ticket price
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketPrice
 *               - numberOfTickets
 *             properties:
 *               ticketPrice:
 *                 type: number
 *                 description: Price of a single ticket
 *                 example: 20
 *               numberOfTickets:
 *                 type: number
 *                 description: Number of tickets to purchase
 *                 example: 3
 *     responses:
 *       200:
 *         description: Ticket found and trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticketId:
 *                       type: string
 *                       example: 691ce5cf9452f6cdf96a3330
 *                     totalPrice:
 *                       type: number
 *                       example: 60
 *       400:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Ticket Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */