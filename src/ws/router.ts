import {Router} from 'express';
import {keycloakConfig} from '../routes/auth/utils/keycloak-config';
import './infrastructure/listener';
import {genTicket} from './features/gen-ticket';

const router = Router();

router.use(keycloakConfig.protect());

// TODO: insert uuid + user uuid when implementation
// For now, the user can get any ticket as he wants
// Add an expiration timestamp
router.post('/ticket', async (_, res) => {
  let status = 200;
  let error: string | null = null;
  let data: string | null = null;

  try {
    const ticket = await genTicket();

    if ('error' in ticket) {
      status = ticket.status;
      error = ticket.error;
    } else data = ticket.ticket;
  } catch (e) {
    status = 500;
    error = 'Could not create a ticket';
  }

  res.status(status).json({
    data,
    error,
  });
});

export default router;
