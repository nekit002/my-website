import jsonServer from 'json-server';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { registrationErrors, profileErrors, courseErrors, feedbackErrors, normalizeEmail, normalizePhone } from '../shared/validation.mjs';

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}

function matchesPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64));
}

export function createApp(source) {
  const app = jsonServer.create();
  const router = jsonServer.router(source);
  const db = router.db;
  const sessions = new Map();
  const root = fileURLToPath(new URL('../', import.meta.url));
  const publicUser = user => Object.fromEntries(['id', 'nickname', 'role', 'firstName', 'lastName', 'middleName', 'birthDate', 'phone', 'email'].map(key => [key, user[key] || '']));
  const fail = (res, status, message, fields = {}) => res.status(status).json({ message, fields });
  const save = (key, values) => db.set(key, values).write();
  const findCourse = id => db.get('courses').find({ id: Number(id) }).value();
  const userItems = (key, user) => db.get(key).filter({ userId: user.id }).value();
  const bought = (user, courseId) => userItems('orders', user).some(order => order.items.some(item => item.courseId === courseId));

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Expose-Headers', 'X-Total-Count, Link');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use(jsonServer.bodyParser);
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const token = (req.get('Authorization') || '').replace(/^Bearer /, '');
    const session = sessions.get(token);
    if (session && session.expires > Date.now()) req.user = db.get('users').find({ id: session.userId }).value();
    else if (session) sessions.delete(token);
    req.token = token;
    next();
  });

  function requireUser(req, res, next) {
    if (!req.user) return fail(res, 401, 'Sign in to continue.');
    next();
  }

  function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') return fail(res, 403, 'Administrator access required.');
    next();
  }

  function loginResponse(user, res, status = 200) {
    const token = randomBytes(32).toString('hex');
    sessions.set(token, { userId: user.id, expires: Date.now() + 8 * 60 * 60 * 1000 });
    res.status(status).json({ token, user: publicUser(user) });
  }

  app.get('/auth/me', requireUser, (req, res) => res.json(publicUser(req.user)));
  app.post('/auth/logout', (req, res) => { sessions.delete(req.token); res.json({ success: true }); });
  app.post('/auth/login', (req, res) => {
    const user = db.get('users').find({ email: normalizeEmail(req.body.email) }).value();
    const password = req.body.password;
    if (!user || typeof password !== 'string' || password.length > 20 || !matchesPassword(password, user.passwordHash)) return fail(res, 401, 'Email or password is incorrect.');
    loginResponse(user, res);
  });
  app.get('/availability', (req, res) => {
    const nickname = String(req.query.nickname || '').trim().toLowerCase();
    res.json({ available: !db.get('users').value().some(user => user.nickname.toLowerCase() === nickname) });
  });
  app.post('/users', (req, res) => {
    const data = req.body;
    const errors = registrationErrors(data);
    const email = normalizeEmail(data.email);
    const phone = normalizePhone(data.phone);
    const nickname = String(data.nickname || '').trim();
    for (const user of db.get('users').value()) {
      if (user.email === email) errors.email = 'This email is already registered.';
      if (user.phone === phone) errors.phone = 'This phone number is already registered.';
      if (user.nickname.toLowerCase() === nickname.toLowerCase()) errors.nickname = 'This nickname is already taken.';
    }
    if (Object.keys(errors).length) return fail(res, 422, 'Check the highlighted fields.', errors);
    const user = {
      id: randomUUID(), role: 'customer', email, phone, nickname,
      firstName: data.firstName.trim(), lastName: data.lastName.trim(), middleName: String(data.middleName || '').trim(),
      birthDate: data.birthDate, passwordHash: hashPassword(data.password),
      termsVersion: '2026-09', acceptedTermsAt: new Date().toISOString()
    };
    db.get('users').push(user).write();
    loginResponse(user, res, 201);
  });
  app.put('/users/me', requireUser, (req, res) => {
    const data = req.body;
    const errors = profileErrors(data);
    const email = normalizeEmail(data.email);
    const phone = normalizePhone(data.phone);
    const nickname = String(data.nickname || '').trim();
    for (const user of db.get('users').value()) {
      if (user.id === req.user.id) continue;
      if (user.email === email) errors.email = 'This email is already registered.';
      if (user.phone === phone) errors.phone = 'This phone number is already registered.';
      if (user.nickname.toLowerCase() === nickname.toLowerCase()) errors.nickname = 'This nickname is already taken.';
    }
    if (Object.keys(errors).length) return fail(res, 422, 'Check the highlighted fields.', errors);
    const changes = {
      firstName: String(data.firstName).trim(), lastName: String(data.lastName).trim(),
      middleName: String(data.middleName || '').trim(), birthDate: data.birthDate,
      phone, email, nickname
    };
    db.get('users').find({ id: req.user.id }).assign(changes).write();
    res.json(publicUser({ ...req.user, ...changes }));
  });
  app.get('/users', requireAdmin, (req, res) => res.json(db.get('users').value().map(publicUser)));

  for (const collection of ['favorites', 'cart']) {
    app.get('/' + collection, (req, res) => {
      const items = req.user ? userItems(collection, req.user) : [];
      res.json(items.filter(item => !req.query.courseId || item.courseId === Number(req.query.courseId)).map(item => req.query._expand === 'course' ? { ...item, course: findCourse(item.courseId) || null } : item));
    });
    app.post('/' + collection, requireUser, (req, res) => {
      const courseId = Number(req.body.courseId);
      if (!findCourse(courseId)) return fail(res, 422, 'Select an existing course.');
      const existing = userItems(collection, req.user).find(item => item.courseId === courseId);
      if (existing) return res.json(existing);
      const item = { id: randomUUID(), userId: req.user.id, courseId };
      if (collection === 'cart') item.quantity = 1;
      db.get(collection).push(item).write();
      res.status(201).json(item);
    });
    app.patch('/' + collection + '/:id', requireUser, (req, res) => {
      const item = userItems(collection, req.user).find(item => item.id === req.params.id);
      if (!item) return fail(res, 404, 'Item not found.');
      if (collection !== 'cart' || !Number.isInteger(req.body.quantity) || req.body.quantity < 1 || req.body.quantity > 99) return fail(res, 422, 'Quantity must be a whole number from 1 to 99.');
      db.get(collection).find({ id: item.id }).assign({ quantity: req.body.quantity }).write();
      res.json({ ...item, quantity: req.body.quantity });
    });
    app.delete('/' + collection + '/:id', requireUser, (req, res) => {
      if (!userItems(collection, req.user).some(item => item.id === req.params.id)) return fail(res, 404, 'Item not found.');
      db.get(collection).remove({ id: req.params.id, userId: req.user.id }).write();
      res.json({});
    });
  }

  app.get('/orders', requireUser, (req, res) => res.json(userItems('orders', req.user)));
  app.post('/orders', requireUser, (req, res) => {
    const cart = userItems('cart', req.user);
    if (!cart.length) return fail(res, 422, 'Your cart is empty.');
    const items = [];
    for (const item of cart) {
      const course = findCourse(item.courseId);
      if (!course) return fail(res, 409, 'A course is no longer available. Remove it from your cart.');
      items.push({ courseId: course.id, title: course.title, price: course.price, quantity: item.quantity });
    }
    const order = {
      id: randomUUID(), userId: req.user.id, createdAt: new Date().toISOString(), items,
      totalCents: items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0)
    };
    const state = db.getState();
    db.setState({ ...state, orders: [...state.orders, order], cart: state.cart.filter(item => item.userId !== req.user.id) }).write();
    res.status(201).json(order);
  });
  app.get('/purchased-courses', requireUser, (req, res) => {
    const ids = new Set(userItems('orders', req.user).flatMap(order => order.items.map(item => item.courseId)));
    res.json([...ids].map(findCourse).filter(Boolean));
  });
  app.get('/feedback', requireUser, (req, res) => {
    let items = req.user.role === 'admin' ? db.get('feedback').value() : userItems('feedback', req.user);
    if (req.query.courseId) items = items.filter(item => item.courseId === Number(req.query.courseId));
    if (req.query.userId) items = items.filter(item => item.userId === req.query.userId);
    res.json(items);
  });
  app.post('/feedback', requireUser, (req, res) => {
    if (req.user.role === 'admin') return fail(res, 403, 'Administrators cannot submit reviews.');
    const data = req.body;
    const errors = feedbackErrors(data);
    if (!findCourse(data.courseId) || !bought(req.user, data.courseId)) errors.courseId = 'You can review only a course you have purchased.';
    if (Object.keys(errors).length) return fail(res, 422, 'Check the highlighted fields.', errors);
    const feedback = { id: randomUUID(), userId: req.user.id, nickname: req.user.nickname, courseId: data.courseId, text: data.text.trim(), createdAt: new Date().toISOString() };
    db.get('feedback').push(feedback).write();
    res.status(201).json(feedback);
  });
  app.delete('/feedback/:id', requireAdmin, (req, res) => {
    if (!db.get('feedback').find({ id: req.params.id }).value()) return fail(res, 404, 'Review not found.');
    db.get('feedback').remove({ id: req.params.id }).write();
    res.json({});
  });
  app.get('/categories', (req, res) => res.json([...new Set(db.get('courses').value().map(course => course.category))].map((name, index) => ({ id: index + 1, name }))));

  app.use('/courses', (req, res, next) => {
    if (req.method === 'GET') return next();
    requireAdmin(req, res, () => {
      if (!['POST', 'PUT', 'DELETE'].includes(req.method)) return fail(res, 405, 'Use POST, PUT or DELETE.');
      if (['PUT', 'DELETE'].includes(req.method) && !findCourse(req.path.slice(1))) return fail(res, 404, 'Course not found.');
      if (req.method === 'POST' || req.method === 'PUT') {
        const errors = courseErrors(req.body);
        if (Object.keys(errors).length) return fail(res, 422, 'Check the highlighted fields.', errors);
        const clean = {};
        for (const field of ['title', 'description', 'category', 'price', 'duration', 'rating', 'level', 'image']) clean[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
        if (req.method === 'POST') {
          clean.id = Math.max(16, db.get('meta.nextCourseId').value() || 16);
          db.set('meta.nextCourseId', clean.id + 1).write();
        }
        else clean.id = Number(req.path.slice(1));
        req.body = clean;
      }
      next();
    });
  });
  app.use((req, res, next) => /^\/courses(?:\/\d+)?$/.test(req.path) ? router(req, res, next) : next());
  app.get('/', (req, res) => res.sendFile('index.html', { root }));
  app.get(/^\/(?:index|catalog|favorites|cart|account|reviews|admin)\.html$/, (req, res) => res.sendFile(req.path.slice(1), { root }));
  app.get(/^\/(?:css|js|images|shared)\/[\w./-]+\.(?:css|js|mjs|png|jpg|jpeg|svg|webp)$/, (req, res) => res.sendFile(req.path.slice(1), { root }));
  app.use((req, res) => fail(res, 404, 'Not found.'));
  app.use((error, req, res, next) => fail(res, error.status || 500, 'The server could not complete the request. Please try again.'));
  return { app, db };
}
