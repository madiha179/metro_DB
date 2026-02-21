/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin and return access token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: metromate534@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin$123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJI..................
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6999c9.......
 *                         ssn:
 *                           type: number
 *                           example: 2803012561333
 *                         name:
 *                           type: string
 *                           example: Admin 1
 *                         email:
 *                           type: string
 *                           example: metromate534@gmail.com
 *                         __v:
 *                           type: number
 *                           example: 0
 *       400:
 *         description: Invalid email or wrong password
 *       500:
 *         description: Server error
 */