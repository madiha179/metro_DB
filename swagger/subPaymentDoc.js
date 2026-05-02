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