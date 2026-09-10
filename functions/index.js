const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

admin.initializeApp();
const db = admin.firestore();

// Set with: firebase functions:config:set stripe.secret="sk_test_..."
const stripe = new Stripe(functions.config().stripe.secret);

async function getOrCreateStripeCustomer(uid) {
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};

  if (userData.stripeCustomerId) {
    return userData.stripeCustomerId;
  }

  const authUser = await admin.auth().getUser(uid);
  const customer = await stripe.customers.create({
    email: authUser.email,
    name: userData.name || authUser.displayName || undefined,
    metadata: { firebaseUID: uid },
  });

  await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
  return customer.id;
}

function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }
  return context.auth.uid;
}

// Creates a SetupIntent so the client can securely collect and save a card
// without any raw card data ever touching our servers or the app's JS.
exports.createSetupIntent = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const customerId = await getOrCreateStripeCustomer(uid);

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });

  return { clientSecret: setupIntent.client_secret };
});

exports.listPaymentMethods = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const customerId = await getOrCreateStripeCustomer(uid);

  const methods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  const paymentMethods = methods.data.map((pm) => ({
    id: pm.id,
    brand: pm.card.brand,
    last4: pm.card.last4,
    expMonth: pm.card.exp_month,
    expYear: pm.card.exp_year,
  }));

  return { paymentMethods };
});

exports.detachPaymentMethod = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const { paymentMethodId } = data;
  if (!paymentMethodId) {
    throw new functions.https.HttpsError('invalid-argument', 'paymentMethodId is required.');
  }

  // Verify the payment method actually belongs to this user's Stripe customer
  // before detaching it, so one user can't remove another user's card.
  const customerId = await getOrCreateStripeCustomer(uid);
  const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (pm.customer !== customerId) {
    throw new functions.https.HttpsError('permission-denied', 'This card does not belong to you.');
  }

  await stripe.paymentMethods.detach(paymentMethodId);
  return { success: true };
});

// Automatically creates a Stripe customer record as soon as a user's Firestore
// profile is created, so it's ready before they ever open Payment Methods.
exports.onUserCreated = functions.firestore
  .document('users/{uid}')
  .onCreate(async (snap, context) => {
    try {
      await getOrCreateStripeCustomer(context.params.uid);
    } catch (e) {
      console.error('Failed to create Stripe customer for new user', e);
    }
  });
