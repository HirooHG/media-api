import {WebSocketServer, type RawData} from 'ws';
import {getTicketById} from '../features/get-ticket-by-id';
import {deleteTicket} from './tickets';
import {
  actionSchema,
  imagesSchema,
  limitSchema,
} from '../../routes/medias/models/schemas/ws-schemas';
import {loadAllMediaChaptersImages} from '../../routes/medias/features/chapters/load-all-media-chapters-images';
import {loadAllMediaChapters} from '../../routes/medias/features/chapters/load-all-media-chapters';

const uuidRegex = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})';
const ticketRegex = 'ticket=' + uuidRegex;
const wss = new WebSocketServer({port: process.env.WS_PORT});

const authent = async (url: string) => {
  const arr = url.split('?')[1]?.match(ticketRegex);
  if (!arr || arr.length < 1) {
    return {ticket: null, isAuth: false};
  }
  const ticket = arr[0].split('=')[1] ?? '';
  return {
    ticket,
    isAuth: !('error' in (await getTicketById(ticket))),
  };
};

wss.on('connection', async (ws) => {
  const {isAuth, ticket} = await authent(ws.url);
  if (!isAuth) {
    ws.close();
    return;
  }
  console.log('Client connecté');

  // INFO: ticket must not be null but in case
  const count = await deleteTicket(ticket ?? '');
  if (count !== 1) {
    console.error('Did not delete ticket from client, did not found any');
  }

  ws.on('message', async (rawData: RawData) => {
    const dataStr = rawData.toString();
    try {
      const obj = JSON.parse(dataStr);
      const {action} = actionSchema.parse(obj);

      switch (action) {
        case 'images':
          const {mediaId} = imagesSchema.parse(obj);
          const resImages = await loadAllMediaChaptersImages(mediaId);
          ws.send(
            JSON.stringify({
              action: 'imagesLoaded',
              result: resImages,
            }),
          );
          break;
        case 'chapters':
          const {limit} = limitSchema.parse(obj);
          const resChaps = await loadAllMediaChapters(limit);
          ws.send(
            JSON.stringify({
              action: 'chaptersLoaded',
              result: resChaps,
            }),
          );
          break;
        case 'hello':
          ws.send(
            JSON.stringify({
              action: 'world',
              result: 'Hello world !',
            }),
          );
          break;
      }
    } catch (e) {
      console.log('error: ', e);
    }
  });
});

export default wss;
