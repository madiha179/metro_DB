/**
 * @swagger
 * /api/v1/dashboard/alllocations:
 *   get:
 *     summary: Get all station locations
 *     description: Returns all metro stations with their name, line number, and coordinates sorted by line then latitude
 *     tags:
 *       - Home Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all station locations
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */