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
 *         description: User's latitude
 *       - in: path
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *     responses:
 *       200:
 *         description: Nearest station found successfully
 *       400:
 *         description: Invalid latitude or longitude provided
 *       404:
 *         description: No station found
 *       500:
 *         description: Server error
 */