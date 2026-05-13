/**
 * @swagger
 * tags:
 *   name: Subscription Payment
 *   description: APIs for handling subscription payments
 */

/**
 * @swagger
 * /api/v1/subscriptions/subscription-pay:
 *   post:
 *     summary: Create subscription payment (cash or visa)
 *     tags: [Subscription Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - subscriptionId
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, visa card]
 *                 example: visa card
 *               subscriptionId:
 *                 type: string
 *                 example: "65f123abc456"
 *     responses:
 *       200:
 *         description: Payment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/subscriptions/subscription-pay/visa:
 *   post:
 *     summary: Get Paymob iframe URL for visa payment
 *     tags: [Subscription Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentKey
 *               - paymentMethod
 *             properties:
 *               paymentKey:
 *                 type: string
 *                 example: "TOKEN_123456"
 *               paymentMethod:
 *                 type: string
 *                 example: visa card
 *     responses:
 *       200:
 *         description: Returns iframe URL
 *       400:
 *         description: Invalid payment method
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/v1/subscriptions/subscription-pay/status:
 *   get:
 *     summary: Get current subscription status
 *     tags: [Subscription Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return subscription status
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/v1/subscriptions/subscription-pay:
 *   get:
 *     summary: Get active subscription data
 *     tags: [Subscription Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return active subscription data
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
 *                     userName:
 *                       type: string
 *                       example: Mark
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: active
 *                         category:
 *                           type: string
 *                           example: public
 *                         duration:
 *                           type: string
 *                           example: monthly
 *                         price:
 *                           type: number
 *                           example: 600
 *                         start_date:
 *                           type: string
 *                           example: May 1, 2026
 *                         end_date:
 *                           type: string
 *                           example: June 1, 2026
 *                         start_station:
 *                           type: string
 *                           example: Helwan
 *                         end_station:
 *                           type: string
 *                           example: Sadat
 *                     office:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Helwan Office
 *                         workingHours:
 *                           type: object
 *                           properties:
 *                             from:
 *                               type: string
 *                               example: "08:00"
 *                             to:
 *                               type: string
 *                               example: "17:00"
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription not found
 *       401:
 *         description: Unauthorized
 */