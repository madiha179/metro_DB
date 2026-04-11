/**
 * @swagger
 * tags:
 *   name: Subscription Types
 *   description: Manage subscription types
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/allsubscriptionstypes:
 *   get:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscription types
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "j12545484kk"
 *                   zones: 1
 *                   category:
 *                     en: military
 *                   duration:
 *                     en: monthly
 *                   prices: 240
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No subscription types found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/createnewsubscriptionstype:
 *   post:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [zones, category, duration, prices]
 *             properties:
 *               zones:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *               category:
 *                 type: string
 *                 enum: [public, students, military, Elderly, special, special needs]
 *               duration:
 *                 type: string
 *                 enum: [monthly, quarterly, yearly]
 *               prices:
 *                 type: number
 *           example:
 *             zones: 1
 *             category: military
 *             duration: monthly
 *             prices: 240
 *     responses:
 *       201:
 *         description: Subscription type created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "j12545484kk"
 *                 zones: 1
 *                 category:
 *                   en: military
 *                 duration:
 *                   en: monthly
 *                 prices: 240
 *       400:
 *         description: Missing fields or already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/updatesubscriptionstype/{id}:
 *   patch:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zones:
 *                 type: integer
 *               category:
 *                 type: string
 *               duration:
 *                 type: string
 *               prices:
 *                 type: number
 *           example:
 *             zones: 2
 *             category: public
 *             duration: quarterly
 *             prices: 300
 *     responses:
 *       200:
 *         description: Subscription type updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: ""
 *                 zones: 2
 *                 category:
 *                   en: public
 *                 duration:
 *                   en: quarterly
 *                 prices: 300
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription type not found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/deletesubscriptionstype/{id}:
 *   delete:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: j12545484kk
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription type not found
 */