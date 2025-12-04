/**
 * @swagger
 * tags:
 *   - name: Tickets
 *     description: Ticket Management API
 */

/**
 * @swagger
 * /api/v1/tickets/getalltickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of all tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 691ce5cf9452f6cdf96a3330
 *                       name:
 *                         type: string
 *                         example: Metro Ticket
 *                       price:
 *                         type: number
 *                         example: 20
 *                       no_of_stations:
 *                         type: number
 *                         example: 5
 *       400:
 *         description: Failed to retrieve tickets
 *       500:
 *         description: Server error
 */
