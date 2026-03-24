/**
 * @swagger
 * tags:
 *   - name: Trips History
 *     description: Trips History API
 */
/**
 * @swagger
 * /api/v1/trips/usertriphistory
 *   get:
 *     summary: Get all user's trip history 
 *     tags: [Trips History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return user's trip history 
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */