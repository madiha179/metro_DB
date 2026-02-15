/**
 * @swagger
 * /api/v1/neareststation/{lat}/{lng}:
 *   get:
 *     summary: Get nearest station to user location
 *     description: Find the nearest metro station based on user's latitude and longitude
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude (e.g., 30.0444)
 *         example: 30.0444
 *       - in: path
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude (e.g., 31.2357)
 *         example: 31.2357
 *     responses:
 *       200:
 *         description: Nearest station found successfully
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
 *                     nearestStation:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Station ID
 *                         name:
 *                           type: string
 *                           description: Station name
 *                         line:
 *                           type: string
 *                           description: Metro line name
 *                         lat:
 *                           type: number
 *                           description: Station latitude
 *                         lng:
 *                           type: number
 *                           description: Station longitude
 *       400:
 *         description: Invalid latitude or longitude provided
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
 *       404:
 *         description: No station found
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
 */